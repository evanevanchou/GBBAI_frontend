import SvgColor from 'src/components/svg-color';

import {
  Message,
  RetrievalMode,
  IConfiguration,
  ChatAppRequest,
  ResponseMessage,
} from 'src/types/chat';

// ----------------------------------------------------------------------

export const getConfiguration = (intialResourceName: string) => ({
  'open-chat-Deployment': intialResourceName,
  'open-chat-Past messages included': '5',
  'open-chat-Temperature': '0.7',
  'open-chat-Top P': '0.95',
  'open-chat-Max response': '1000',
  'open-chat-Stop sequence': '0',
  'open-chat-Frequency penalty': '0',
  'open-chat-Presence penalty': '0',
  'open-chat-Should stream': true,
  'open-chat-System message': `You are an assistant designed to help people perform tasks such as answering questions`,

  'rag-Deployment': intialResourceName,
  'rag-Past messages included': '5',
  'rag-Temperature': '0.7',
  'rag-Top P': '0.95',
  'rag-Max response': '1000',
  'rag-Stop sequence': '0',
  'rag-Frequency penalty': '0',
  'rag-Presence penalty': '0',
  'rag-Retrieve count': '10',
  'rag-Retrieval mode': 'hybrid',
  'rag-Use semantic ranker': true,
  'rag-Should stream': true,
  'rag-System message': `You are a helpful assistant. Try to answer user's question by referencing the following related background information.
  If there is not enough information to answer user's question, just say not enough information.`,
  'rag-index': 'index-servicesau',

  'function-calling-Deployment': intialResourceName,
  'function-calling-Past messages included': '5',
  'function-calling-Temperature': '0.7',
  'function-calling-Top P': '0.95',
  'function-calling-Max response': '1000',
  'function-calling-Stop sequence': '0',
  'function-calling-Frequency penalty': '0',
  'function-calling-Presence penalty': '0',
  'function-calling-Should stream': true,
  'function-calling-System message': `You are an assistant designed to help people perform tasks such as answering questions, drawing images, calling functions, and etc.
  You have access to several tools and sometimes you may need to call multiple tools in sequence to get answers for your users.
  Please keep in mind: 
  1. Don't make assumptions about what values to use with functions. Ask for clarification if a user request is ambiguous.
  2. Don't alter the output of the function call.
  3. Don't change the table data from the output of the function call.
  4. Never change the http/https url from the output of the function call.`,
});

export const promptExamplesCards = {
  'open-chat': [
    {
      title: 'Write a piece of code',
      content: 'Write a bubble sort algorithm in Python language.',
    },
    {
      title: 'Azure Helper',
      content: 'How to start an Azure VM?',
    },
    {
      title: 'Intent classification',
      content:
        '"提供北京到上海的交通路线"。这句话的意图属于下列选项中的哪一项: 1.交通查询; 2.查询数据; 3.生成摘要',
    },
  ],
  rag: [
    {
      title: 'Sample 1',
      // content: '使用Python语言写一段冒泡排序算法',
      content: 'Summarize the youth allowance.',
    },
    {
      title: 'Sample 2',
      // content: 'Mój klawisz Ctrl jest zepsuty.\n 上面这句话是什么语言?',
      content: 'Guide me through the process for a concession card.',
    },
    {
      title: 'Sample 3',
      // content: '"提供北京到上海的交通路线"。这句话的意图属于下列选项中的哪一项: 1.交通查询; 2.查询数据; 3.生成摘要',
      content: 'What is the requirement for Aged Pension?',
    },
  ],
  'function-calling': [
    {
      title: 'Bing search',
      content: 'How tall is mount rainier?',
      icon: (
        <SvgColor
          src="/assets/icons/soft/ic-search.svg"
          sx={{ width: 32, height: 32, minWidth: 36, color: 'primary.main', my: '20px' }}
        />
      ),
    },
    {
      title: 'Query time',
      content: 'What time is it in New York?',
      icon: (
        <SvgColor
          src="/assets/icons/soft/ic-timer.svg"
          sx={{ width: 32, height: 32, minWidth: 36, color: 'warning.dark', my: '20px' }}
        />
      ),
    },
    {
      title: 'Custom data',
      content: 'Compare the product sales of 2022 and 2023 by month, and present it in a table.',
      icon: (
        <SvgColor
          src="/assets/icons/soft/ic-calc.svg"
          sx={{ width: 32, height: 32, minWidth: 36, color: 'success.main', my: '20px' }}
        />
      ),
    },
    {
      title: 'Stock data',
      // content: 'Campare monthly sales number in the past 2 years in one table.',
      content: `Show the stock price history of Microsoft from Nov.20 to Dec.10, 2023.\n
Remember: 
1. Organize the data in a table.
2. Use YYYY-MM-DD format for date information.
3. If there are decimals, please keep two places after the decimal point.`,

      icon: (
        <SvgColor
          src="/assets/icons/soft/ic-sales.svg"
          sx={{ width: 32, height: 32, minWidth: 36, color: '#B377FF', my: '20px' }}
        />
      ),
    },
    {
      title: 'Draw image',
      content: `A whale shark swimming beneath a kayak in still water at night, viewed from above, detailed`,
      icon: (
        <SvgColor
          src="/assets/icons/soft/ic-draw.svg"
          sx={{ width: 32, height: 32, minWidth: 36, color: '#1877F2', my: '20px' }}
        />
      ),
    },
    {
      title: 'Video retrieval',
      content: `Display the current video stream of the crossroads.`,
      icon: (
        <SvgColor
          src="/assets/icons/soft/ic-video-retrieval.svg"
          sx={{ width: 32, height: 32, minWidth: 36, color: '#F080A3', my: '20px' }}
        />
      ),
    },
  ],
} as any;

export const onComposeRequest = (
  messages: Message[],
  chatMode: string,
  messagesToInclude: string,
  configurations: IConfiguration
) => {
  const gptMessages: any[] = [];
  messages.slice(-messagesToInclude - 1).forEach((message) => {
    const { body, senderId, function_calls, attachments } = message;

    if (function_calls !== undefined && function_calls.length > 0) {
      if (!body.startsWith('(SYS)function')) {
        gptMessages.push({ content: body, role: 'assistant', attachments });
      }

      function_calls.forEach((function_call: any) => {
        const { funcName, funcArgs, results } = function_call;

        if (chatMode === 'function-calling') {
          gptMessages.push({
            content: '',
            role: 'assistant',
            function_call: { name: funcName, arguments: funcArgs },
          });
        }

        if (results && results.length > 0)
          gptMessages.push({
            content: results,
            role: chatMode === 'function-calling' ? 'function' : 'assistant',
            name: funcName,
          });
      });
    } else {
      gptMessages.push({
        content: body,
        role: senderId.endsWith('0') ? 'user' : 'assistant',
        attachments,
      });
    }
  });

  return formRequest({
    chatMode,
    messages: gptMessages,
    configurations,
  });
};

type Props = {
  chatMode: string;
  messages: ResponseMessage[];
  shouldStream?: boolean;
  retrieveCount?: number;
  retrievalMode?: RetrievalMode;
  useSemanticRanker?: boolean;
  useSemanticCaptions?: boolean;
  useSuggestFollowupQuestions?: boolean;
  useGroupsSecurityFilter?: boolean;
  useOidSecurityFilter?: boolean;
  useFunctions?: boolean;
  session_state?: string;
  configuration?: { [key: string]: any };
  configurations?: IConfiguration;
};

export function formRequest({
  chatMode,
  messages,
  useSemanticCaptions = false,
  useSuggestFollowupQuestions = false,
  useGroupsSecurityFilter = false,
  useOidSecurityFilter = false,
  session_state = '',
  configurations = undefined,
}: Props) {
  const sysMsg = `${chatMode}-System message`;
  const useFunctions = chatMode === 'function-calling';
  const request: ChatAppRequest = {
    messages,
    stream: configurations ? configurations[`${chatMode}-Should stream`] : false,
    context: {
      overrides: {
        prompt_template: configurations ? configurations[sysMsg] : undefined,
        exclude_category: undefined,
        temperature: configurations ? Number(configurations[`${chatMode}-Temperature`]) : 0.7,
        max_tokens: configurations ? Number(configurations[`${chatMode}-Max response`]) : 1000,
        top: configurations ? Number(configurations['rag-Retrieve count']) : 3,
        retrieval_mode: configurations ? configurations['rag-Retrieval mode'] : 'hybrid',
        semantic_ranker: configurations ? configurations['rag-Use semantic ranker'] : false,
        semantic_captions: useSemanticCaptions,
        suggest_followup_questions: useSuggestFollowupQuestions,
        use_oid_security_filter: useOidSecurityFilter,
        use_groups_security_filter: useGroupsSecurityFilter,
      },
      functions: useFunctions ? functionList : [],
    },
    // ChatAppProtocol: Client must pass on any session state received from the server
    session_state: session_state.length === 0 ? null : session_state,
  };
  return request;
}

const functionList = [
  {
    name: 'book_resturant',
    description:
      'Book a restaurant in a given category and id when the user wants to book a restaurant',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description:
            'The category of the restaurant, e.g. Chinese, Japanese, Steak, Coffee, Pizza etc.',
        },
        id: {
          type: 'string',
          description: 'the id of the restaurant, e.g. 1, 2, 3, 4, 5 etc.',
        },
      },
      required: ['category', 'id'],
    },
  },
  {
    name: 'get_resturant_list',
    description: 'Get the list of restaurants in a given category when the user asks for it',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description:
            'The category of the restaurant, e.g. Chinese, Japanese, Steak, Coffee, Pizza etc.',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_football_match_data',
    description:
      'Get the match results and statistics of a football match, given the teams and date when the match was played',
    parameters: {
      type: 'object',
      properties: {
        localTeam: {
          type: 'string',
          description: 'The team that played at home',
        },
        visitorTeam: {
          type: 'string',
          description: 'The team that played away',
        },
        date: {
          type: 'string',
          description: 'The date when the match was played in the format YYYY-MM-DD',
        },
      },
      required: ['localTeam', 'visitorTeam', 'date'],
    },
  },
  {
    name: 'search_bing',
    description: 'Searches bing to get up to date information from the web',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_current_weather',
    description: 'Get the current weather in a given location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'get_current_time',
    description: 'Get the current time in a given location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description:
            'The location name. The pytz is used to get the timezone for that location. Location names should be in a format like America/New_York, Asia/Bangkok, Europe/London',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'get_stock_market_data',
    description: 'Get the stock market data for a given index',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          enum: [
            'S&P 500',
            'NASDAQ Composite',
            'Dow Jones Industrial Average',
            'Financial Times Stock Exchange 100 Index',
          ],
        },
      },
      required: ['index'],
    },
  },
  {
    name: 'get_sales_data',
    description: 'Get the sales number with respect to time',
    parameters: {
      type: 'object',
      properties: {
        years: {
          type: 'string',
          description: 'The concatenated string of time array, such as 2021, 2022;2023, and etc.',
        },
      },
      required: ['years'],
    },
  },
  {
    name: 'calculator',
    description: 'A simple calculator used to perform basic arithmetic operations',
    parameters: {
      type: 'object',
      properties: {
        num1: {
          type: 'number',
        },
        num2: {
          type: 'number',
        },
        operator: {
          type: 'string',
          enum: ['+', '-', '*', '/', '**', 'sqrt'],
        },
      },
      required: ['num1', 'num2', 'operator'],
    },
  },
  {
    name: 'draw',
    description: "Uses Dall-E to draw an image based on user's prompt",
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The prompt to use to generate the image',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'video_retrieve',
    description: 'Retives a video from the database based on the given location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The location of the video',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'get_stock_data',
    description: 'Fetch the stock price of a given company',
    parameters: {
      type: 'object',
      properties: {
        stock_code: {
          type: 'string',
          description: 'The stock code of the company',
        },
        start_date: {
          type: 'string',
          description: 'The start date of the period in the format YYYY-MM-DD',
        },
        end_date: {
          type: 'string',
          description: 'The end date of the period in the format YYYY-MM-DD',
        },
      },
      required: ['stock_code', 'start_date', 'end_date'],
    },
  },
  {
    name: 'get_popular_commodities',
    description: 'Fetch the top-k popular commodities of a given category',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description:
            'The commodity category. It should be one of the following options: tent, skirt, bicycle.',
        },
        topK: {
          type: 'string',
          description: 'The number of commodities to return to user',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'customs_declaration',
    description: 'Declare goods that are being imported or exported.',
    parameters: {
      type: 'object',
      properties: {
        item: {
          type: 'string',
          description:
            'The item information which is a strict json string. It should be like: {"item": {"key1": "value1", "key2": "value2", "key3": "value3"}}',
        },
      },
      required: ['item'],
    },
  },
];
