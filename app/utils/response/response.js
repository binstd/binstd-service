const format = (data, code = 0, msg = 'ok') => {
   var arr = Object.keys(data);
   return {
    code,
    msg,
    data
  }
//   if( arr.length != 0){
//     return {
//         code,
//         msg,
//         data
//       }
//     } else {
//     return {
//         code,
//         msg
//       }
//     }  
  }
  

export {
  format
}
