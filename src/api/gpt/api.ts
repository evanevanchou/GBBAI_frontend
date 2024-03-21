import readNDJSONStream from 'ndjson-readablestream';

import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import axios from 'src/utils/axios';
import uuidv4 from 'src/utils/uuidv4';

import { BACKEND_API, FUNCTION_API, AI_SEARCH_KEY, AI_SEARCH_ENDPOINT } from 'src/config-global';

import {
  ChatAppRequest,
  ChatAppResponse,
  ResponseMessage,
  ChatAppResponseOrError,
} from 'src/types/chat';

// ----------------------------------------------------------------------

const getHeaders = (idToken: string | undefined): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (idToken && idToken.length > 0) {
    headers.Authorization = idToken;
  }

  return headers;
};

const convertBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
      console.error(error);
    };
  });

// const getCitationFilePath = (citation: string): string => {
//   return `${BACKEND_API}/content/${citation}`;
// };

const parseFunctionResponse = async (parsedResponse: any, onSend: Function) => {
  const funcArgStr = parsedResponse.choices[0].message.function_call.arguments;
  const funcName = parsedResponse.choices[0].message.function_call
    ? parsedResponse.choices[0].message.function_call.name
    : '';
  const funcArgs = funcArgStr ? JSON.parse(funcArgStr) : {};
  onSend({
    content: `(SYS)function calling: ${funcName}`,
    senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
    mode: 'attach',
    function_calls: [{ funcName, funcArgs: funcArgStr, results: '' }],
  });

  const response = await pluginApi(funcArgs, funcName);

  if (response && response.status === 200) {
    onSend({
      content: `(SYS)function executed: ${funcName}`,
      senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
      mode: 'attach',
      function_calls: [{ funcName, funcArgs: funcArgStr, results: JSON.stringify(response.data) }],
    });
  } else if (response && response.status > 299) {
    const content = `Error: ${response.status}  ${response.statusText}`;
    onSend({
      content,
      senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
      mode: 'new',
    });
  }
};

const handleAsyncRequest = async (setAnswers: Function, responseBody: ReadableStream<any>) => {
  let answer: string = '';
  let askResponse: ChatAppResponse = {} as ChatAppResponse;

  const updateState = (newContent: string) =>
    new Promise((resolve) => {
      answer += newContent;
      setAnswers(answer);
      resolve(null);
    });
  // new Promise((resolve) => {
  //    setTimeout(() => {
  //      answer += newContent;
  //      setAnswers(answer);
  //      resolve(null);
  //    }, 50);
  //  });
  // );

  try {
    for await (const event of readNDJSONStream(responseBody)) {
      if (event.choices && event.choices[0].context && event.choices[0].context.data_points) {
        event.choices[0].message = event.choices[0].delta;
        askResponse = event as ChatAppResponse;
      } else if (event.choices && event.choices[0].delta.content) {
        await updateState(event.choices[0].delta.content);
      } else if (event.choices && event.choices[0].context) {
        // Update context with new keys from latest event
        askResponse.choices[0].context = {
          ...askResponse.choices[0].context,
          ...event.choices[0].context,
        };
      } else if (event.error) {
        throw Error(event.error);
      }
    }
  } catch (error) {
    setAnswers(error.message);
  }
};

export async function chatApi(
  request: ChatAppRequest,
  idToken: string | undefined,
  aoaiConfig: Record<string, string>,
  streaming?: boolean
): Promise<Response> {
  return fetch(`${BACKEND_API}/aoai`, {
    method: 'POST',
    headers: getHeaders(idToken),
    body: JSON.stringify({
      ...request,
      aoai_config: aoaiConfig,
      ...(streaming !== undefined && { stream: streaming }),
    }),
  });
}

export async function aoaiVisionApi(
  messages: ResponseMessage[],
  idToken: string | undefined,
  sendMessage: Function,
  aoaiConfig: Record<string, string>
) {
  const payload = {
    enhancements: {
      ocr: {
        enabled: true,
      },
      grounding: {
        enabled: true,
      },
    },
    messages,
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 800,
    stream: true,
  };

  const GPT4V_ENDPOINT = `${aoaiConfig.azure_endpoint}openai/deployments/${aoaiConfig.deployment}/extensions/chat/completions?api-version=${aoaiConfig.api_version}`;

  let answer: string = '';
  const updateState = (newContent: string) =>
    new Promise((resolve) => {
      answer += newContent;
      sendMessage(answer);
      resolve(null);
    });

  // {
  //   new Promise((resolve) => {
  //     setTimeout(() => {
  //       answer += newContent;
  //       sendMessage(answer);
  //       resolve(null);
  //     }, 33);
  //   });
  // }
  try {
    await fetch(GPT4V_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': aoaiConfig.api_key,
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response && response.status > 299) {
        const content = `Error: ${response.status}  ${response.statusText}`;
        sendMessage(content, '8864c717-587d-472a-929a-8e5f298024da-1', [], 'new', []);
        return;
      }

      if (response.body !== null) {
        const reader = response.body.getReader();

        let done = false;
        while (!done) {
          const { done: isDone, value } = await reader.read();
          done = isDone;
          if (done) break;
          const text = new TextDecoder('utf-8').decode(value);

          const items = text.split('data:');
          for (const item of items) {
            try {
              const daObject = JSON.parse(item);
              const content = daObject?.choices?.[0]?.messages?.[0]?.delta?.content;
              if (content && !content.startsWith(`{"grounding"`)) {
                updateState(content);
              }
            } catch (error) {
              console.error(error);
            }
          }

          // for await (const item of text.split('data:')) {
          //   try {
          //     const daObject = JSON.parse(item);
          //     const content = daObject?.choices?.[0]?.messages?.[0]?.delta?.content;
          //     if (content && !content.startsWith(`{"grounding"`)) {
          //       await updateState(content);
          //     }
          //   } catch (error) {
          //     console.error(error);
          //   }
          // }
        }
      }
    });
  } catch (error) {
    sendMessage(error.message, '8864c717-587d-472a-929a-8e5f298024da-1', [], 'new', []);
  }
}

export const askApi = async (
  request: ChatAppRequest,
  idToken: string | undefined,
  indexName: string | undefined,
  aoaiConfig: Record<string, string>
): Promise<Response> => {
  if (!indexName) return null as any;
  return fetch(`${BACKEND_API}/chat`, {
    method: 'POST',
    headers: getHeaders(idToken),
    body: JSON.stringify({
      ...request,
      aoai_config: aoaiConfig,
      ai_search_config: {
        endpoint: AI_SEARCH_ENDPOINT,
        index_name: indexName,
        key: AI_SEARCH_KEY,
      },
    }),
  });
};

export const pluginApi = async (params: Object, functionName: string) => {
  const response = await axios.post(FUNCTION_API, {
    action: functionName,
    params,
  });

  return response;
};

type Props = {
  mode: string;
  onSend: Function;
  request: ChatAppRequest;
  shouldStream: boolean;
  aoaiResourceName: string;
  indexName?: string;
  buttonContent?: string;
};

export const makeApiRequest = async ({
  mode,
  onSend,
  request,
  shouldStream,
  aoaiResourceName,
  indexName = undefined,
  buttonContent = undefined,
}: Props) => {
  // const token = undefined;
  // console.log(request);
  // console.log(mode);
  try {
    const setResponse = (response: any) => {
      onSend({
        content: response,
        senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
        mode: 'attach',
        msgId: uuidv4(),
      });
    };

    let hasFiles = false;
    const reformedMessages = request.messages.map(async (message) => {
      const { role, content, attachments, name, function_call } = message;

      if (mode !== 'function-calling' && attachments && attachments.length > 0) {
        hasFiles = true;
        const imgContents = await Promise.all(
          attachments!.map(async (attachment) => ({
            type: 'image_url',
            image_url: {
              url: attachment.preview.startsWith('data:')
                ? attachment.preview
                : await convertBase64(attachment),
            },
          }))
        );
        return { role, content: [...imgContents, { type: 'text', text: content }] };
      }
      return { role, content, ...(name && { name }), ...(function_call && { function_call }) };
    });

    const reformedRequest = {
      ...request,
      messages: [
        ...(await Promise.all(reformedMessages)),
        ...(buttonContent ? [{ content: buttonContent, role: 'user' }] : []),
      ],
    };

    const aoai_credentials = getStorage(AOAI_CREDENTIAL_KEY);
    const aoaiConfig =
      aoai_credentials &&
      aoai_credentials.find((item: any) => item.resourceName === aoaiResourceName);

    if (!aoaiConfig) {
      onSend({
        content:
          'No AOAI resource was located. Please add an AOAI resource on the User/Account page first.',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
        mode: 'new',
      });
      return;
    }

    const aoai = {
      api_version: aoaiConfig.apiVersion,
      azure_endpoint: aoaiConfig.endpoint,
      api_key: aoaiConfig.key,
      model: aoaiConfig.model,
      deployment: aoaiConfig.deployment,
    };

    if (hasFiles) {
      await aoaiVisionApi(reformedRequest.messages, undefined, setResponse, aoai);
      return;
    }

    let response;
    if (mode === 'open-chat') {
      response = await chatApi(reformedRequest, undefined, aoai);
      // await aoaiVisionApi(reformedRequest.messages, undefined, setResponse)
    } else if (mode === 'rag') {
      if (indexName !== '') response = await askApi(reformedRequest, undefined, indexName, aoai);
      else {
        onSend({
          content: 'No custom knowledge was selected. The answer is based on LLM knowledge.',
          senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
          mode: 'new',
        });
        response = await chatApi(reformedRequest, undefined, aoai);
      }
    } else {
      response = await chatApi(reformedRequest, undefined, aoai, false);
    }

    if (response === null) {
      onSend({
        content: 'No response from server. Please check your configuration.',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
        mode: 'new',
      });
      return;
    }

    if (!response.body) {
      throw Error('No response body');
    }
    if (shouldStream && mode !== 'function-calling') {
      await handleAsyncRequest(setResponse, response.body);
    } else {
      const parsedResponse: ChatAppResponseOrError = await response.json();
      if (response.status > 299 || !response.ok) {
        onSend({
          content: parsedResponse.error,
          senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
          mode: 'new',
        });
        throw Error(parsedResponse.error || 'Unknown error');
      }
      if (parsedResponse && parsedResponse.choices) {
        if (parsedResponse.choices[0].finish_reason === 'function_call') {
          parseFunctionResponse(parsedResponse, onSend);
        } else {
          onSend({
            content: parsedResponse.choices[0].message.content,
            senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
            mode: 'attach',
          });
        }
      }
    }
  } catch (e) {
    onSend({
      content: e.message,
      senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
      mode: 'new',
    });
  }
};
