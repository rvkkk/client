import { useState, useEffect } from "react";
import { Alert } from "react-native";
//import { useQuery } from "react-query";

const useApi = (fn: () => Promise<any>) => {
  const [data, setData] = useState<any[] | Object>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response: Promise<any> = fn(); //await
      setData(await response);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useApi;

// const useApi1 = (fn: () => Promise<any>) => {
//   const fetchData = async () => {
//     try {
//       const response: Promise<any> = fn(); //await
//       return response;
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   const { data, error, isLoading } = useQuery("fetchData", fetchData);

  
//   const refetch = () => fetchData();
//   if (error) return 'An error has occurred: ' //+ //error.message
//   return { data, isLoading, refetch };
// };
