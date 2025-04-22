<template>
    <Button label="Печать" @click="downloadAndPrintPdf"/>
</template>

<script lang="ts" setup>
const route = useRoute()
// const {data} = await useAPI(`/visitors/change?id=${route.query.uuid}`)
// console.log(data.value);
const downloadAndPrintPdf = async () => {
  try {
    // Выполняем запрос на получение PDF
    const {data, status} = await useAPI(`/visitors/change?id=${route.query.uuid}`, {
        headers:{
            'Content-Type':'application/pdf'
        }
    });
    console.log(status.value);
    
    

    // Получаем PDF в виде Blob
   
    const pdfUrl = URL.createObjectURL(data.value);

    // Открываем PDF в новом окне для печати
    const pdfWindow = window.open(pdfUrl);
    if (pdfWindow) {
      pdfWindow.addEventListener('load', () => {
        pdfWindow.print();
      });
    }
  } catch (error) {
    console.error('Error fetching or printing PDF:', error);
  }
};



</script>