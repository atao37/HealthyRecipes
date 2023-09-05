export const formatTime = (time) => {
  const _time=new Date(time);
  const year = _time.getFullYear()
  const month = _time.getMonth() + 1
  const day = _time.getDate()

  return `${year}-${month}-${day}`;
}

export const ajax = (url,method,data)=>{
   const base_url= 'http://localhost:3000';
   return new Promise((resolve,reject)=>{
      wx.request({
        url: `${base_url}${url}`,
        method: method? method : 'GET',
        data,
        success:(res)=>{
           resolve(res);
        },
        fail:(err)=>{
           reject(err);
        }
      })
   })
}
