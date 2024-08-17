import axios from "axios";

export const getAccessToken = async () => {
  
  try {

      const response = await axios.post('https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'openid',
          client_id: process.env.OLA_MAPS_CLIENT_ID!,
          client_secret: process.env.OLA_MAPS_CLIENT_SERET!,
        })
      );
  
      const accessToken = response.data.access_token;
      console.log('Access Token:', accessToken);
      
      return accessToken;

    } catch (error) {
      console.error('Error fetching access token:', error );
    }
  }
