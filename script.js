const sidebar =document.querySelector('.sidebar');
const fabars =document.querySelector('.fa-bars');

fabars.addEventListener('click',() => {
    sidebar.classList.toggle('active');
});

async function generatePoem() {
    const prompt = document.getElementById('prompt').value;
    const response = await fetch('/generate-poem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    document.getElementById('result').textContent = data.data.content || 'No poem was generated.';
}




const textContainer = document.getElementById('textoutput');
const message = result; // 您想要打印的文本
let index = 0;

// 定义一个函数来模拟打字机效果
function typeWriterEffect() {
  if (index < message.length) {
    // 创建一个span以逐字显示
    let span = document.createElement('span');
    span.textContent = message[index++];
    textContainer.appendChild(span);

    // 设置时间间隔为50ms后添加下一个字符
    setTimeout(typeWriterEffect, 100);
  } else {
    // 文本全部打印完毕，更新所有span为可见
    document.querySelectorAll('#textoutput span').forEach(function(span) {
      span.style.visibility = 'visible';
    });
    // 文本打印完毕后，设置容器的white-space为normal，以便可以进行正常的换行
    textContainer.style.whiteSpace = 'normal';
  }
}

typeWriterEffect(); // 开始打字机效果

