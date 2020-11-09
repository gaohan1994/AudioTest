export const API_URL = {
  send: 'ws://test.xfyousheng.com/vclip/v1/send',
  receive: 'ws://test.xfyousheng.com/vclip/v1/receive',
};

export const api_common = () => {
  return {
    base: {
      appId: 'centerm',
      version: '1.0',
      timeStamp: `${new Date().valueOf()}`,
    },
  };
};
