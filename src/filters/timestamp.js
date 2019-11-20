export default function (time) {
  const month = new Date(time * 1000).getMonth() < 10 ? 0 + (new Date(time * 1000).getMonth() + 1) :new Date(time * 1000).getMonth() + 1;
  const date = new Date(time * 1000).getDate() < 10 ? 0 + new Date(time * 1000).getDate() : new Date(time * 1000).getDate();
  
  const formatTime = `${new Date(time * 1000).getFullYear()}-${month}-${date}`;
    return formatTime;
  }