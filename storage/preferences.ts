import * as SecureStore from "expo-secure-store";

const saveItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const checkIfSupportsSecureStore = async () => {
  return await SecureStore.isAvailableAsync();
};

const getItem = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export { saveItem, getItem, checkIfSupportsSecureStore };
