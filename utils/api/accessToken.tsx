import * as SecureStore from 'expo-secure-store';

export const saveToken = async (token: string) => {
  try {
    //localStorage.setItem('token', token);
    await SecureStore.setItemAsync('token', token);
  } catch (error) {
    console.error('Error saving token', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token =  await SecureStore.getItemAsync('token') //localStorage.getItem('token');
    return token;
  } catch (error) {
    console.log('Error getting token', error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    //localStorage.removeItem('token');
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error("Error removing token", error);
  }
};
