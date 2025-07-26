const userInfo = JSON.parse(localStorage.getItem("userInfos"));
function TOAST(message, color) {
  const toast = document.getElementById("toast");
  toast.style.backgroundColor = color;
  document.getElementById("text").innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}

function sendEmail(){
    const Name=userInfo.name;
    const Message=document.getElementById("contactText");
    const Email=document.getElementById("email");
    if(Message.value==""||Email.value==""){
        TOAST("text area or email is empty","red");
    }
    else{
        let params={
        name:Name,
        message:Message,
    }
    emailjs.send("service_iuufj3s","template_rfg3hbi",params).then(()=>{
        TOAST('email was sent successfully',"green");
        Message.value="";
        Email.value="";
    });
    }
    
}
document.addEventListener("DOMContentLoaded", () => {

    const sendBtn=document.getElementById("send");
    sendBtn.addEventListener("click",()=>{
        sendEmail();
    })
});