import { Visitor } from "../entities/visitor.entity";

export  const getHtmlMessage = (visitor:Visitor, qrImg:string) =>{
    const html = `
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background: #f9fafb;
        margin: 0;
        padding: 40px;
      }

      .ticket {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header h1 {
        font-size: 24px;
        color: #111827;
        margin: 0;
      }

      .event {
        font-size: 18px;
        color: #374151;
        margin-top: 10px;
      }

      .details {
        margin-bottom: 30px;
      }

      .details p {
        margin: 6px 0;
        font-size: 14px;
        color: #374151;
      }

      .details strong {
        color: #111827;
      }

      .qr {
        text-align: center;
        margin-bottom: 30px;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        margin: auto;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
  
      @media print {
        body, .page {
          box-shadow: none;
          margin: 0;
          padding: 0;
        }
      }
      h1 {
        text-align: center;
      }
      .img{
          position: absolute;
      }
  
      p {
       margin: 0;
      }
      .top{
          width: 100%;
          height: 39px;
          background: rgba(18, 75, 150, 1);
      }
      .bottom{
          width: 100%;
          height: 39px;
          background: rgba(18, 75, 150, 1);
  
      }
      .three{
          left: 370px;
      }
      .logo{
          position: absolute;
          left: 430px;
          top: 180px;
          display: flex;
          gap: 4px;
      }
      .logo p{
          font-size: 16px;
          width: 148px;
      }
      .logo img{
          width: 100%;
      }
      .info{
          position: absolute;
          top: 390px;
          left: 120px;
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      .qr-block{
          position: absolute;
          top: 570px;
          left: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .qr-border{
          border: 2px solid black;
          border-radius: 40px;
          width: 280px;
          height: 305px;
         
          
      }
      .qr img {
        width: 180px;
        height: 180px;
      }

      .footer {
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        border-top: 1px dashed #d1d5db;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
  <div class="page">
  <div class="figures">
      <img class="img" src="./img/Vector 1.png" alt="">
      <img class="img three" src="./img/Vector 3.png" alt="">
      <img class="img atakent" src="./img/atakent 1.png" alt="">
      <img class="img" src="./img/Vector 2.png" alt="">
      <div class="top"></div>
     
  </div>
  <div class="logo">
      <img src="./img/atakent.png" alt="">
      <p>Международная 
          Выставочная
          Компания</p>
  </div>
  <div class="info">
      <p>ФИО</p>
      <p>Дата регистрации:</p>
      <p>ID билета:</p>
  </div>
  <div class="qr-block">
      <h2>ВАШ БИЛЕТ НА ВЫСТАВКУ</h2>
      <div class="qr-border">

      </div>
  </div>
  <div class="bottom"></div>
</div>
  </body>
</html>
`;
return html
}