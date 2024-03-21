// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Administrator',
    email: 'demo@gbb-ai.com',
    password: 'demo1234',
    photoURL: '/assets/avatars/avatar_1.jpg',
    phoneNumber: '',
    country: '',
    address: '',
    state: '',
    city: '',
    zipCode: '94116',
    about: '',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
