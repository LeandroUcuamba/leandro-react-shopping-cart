import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logoImg from '../asset/logo.png';
import carimboImg from '../asset/carimbo.png';

export default function Basket(props) {
  const { cartItems, onAdd, onRemove } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const totalPrice = itemsPrice;

  const basketRef = useRef(null);

  const handleDownloadPDF = () => {
    const input = basketRef.current;
  
    const buttons = input.querySelectorAll('.remove, .add');
    buttons.forEach(button => {
      button.style.display = 'none';
    });
  
    const pdf = new jsPDF();
  
    const getBase64Image = (imgUrl) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = imgUrl;
      });
    };
  
    Promise.all([getBase64Image(logoImg), getBase64Image(carimboImg)])
      .then(([logoData, carimboData]) => {
        
        const logoWidth = 100;
        const logoHeight = 18;
        pdf.addImage(logoData, 'PNG', 6, 7, logoWidth, logoHeight);
  
        const carimboWidth = 90;
        const carimboHeight = 30;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const x = (pdfWidth - carimboWidth) / 2;
        const y = (pdfHeight - carimboHeight) / 1.7;
        pdf.addImage(carimboData, 'PNG', x, y, carimboWidth, carimboHeight);
  
        html2canvas(input)
          .then((canvas) => {
            buttons.forEach(button => {
              button.style.display = 'inline-block';
            });
  
            const contentImgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(contentImgData);
            const contentWidth = pdf.internal.pageSize.getWidth() / 1.7;
            const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
            const contentX = (pdf.internal.pageSize.getWidth() - contentWidth) / 7;
            const contentY = (pdf.internal.pageSize.getHeight() - contentHeight) / 8;
            pdf.addImage(contentImgData, 'PNG', contentX, contentY, contentWidth, contentHeight);
  
            const now = new Date();
            const dateTimeString = now.toLocaleString();
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.text(dateTimeString, pdf.internal.pageSize.getWidth() - 60, pdf.internal.pageSize.getHeight() - 10);
  
            pdf.save('Restaurante_Mbingula_pedido.pdf');
          });
      })
      .catch(error => {
        console.error('Erro ao carregar as imagens:', error);
      });
  };

  return (
    <aside className="block col-2">
      <div style={{ marginBottom: '10px' }}>
        <h1 style={{ color: 'blue' }}>Restaurante Mbingula</h1>
      </div>
      <div ref={basketRef} id="basket-content">
        <h2>Pedido</h2>
        {cartItems.length === 0 && <div>Nenhum produto adicionado</div>}
        {cartItems.map((item) => (
          <div key={item.id} className="row">
            <div className="col-2">{item.name}</div>
            <div className="col-2">
              <button onClick={() => onRemove(item)} className="remove">
                -
              </button>{' '}
              <button onClick={() => onAdd(item)} className="add">
                +
              </button>
            </div>
            <div className="col-2 text-right">
              {item.qty} x {item.price.toFixed(2)}Kz
            </div>
          </div>
        ))}

        {cartItems.length !== 0 && (
          <>
            <hr />
            <div className="row">
              <div className="col-2">
                <strong>Preço Total</strong>
              </div>
              <div className="col-1 text-right">
                <strong>{totalPrice.toFixed(2)}Kz</strong>
              </div>
            </div>
            <hr />
          </>
        )}
      </div>

      {cartItems.length !== 0 && (
        <div className="row">
          <button onClick={handleDownloadPDF} id="btn-solicitar">
            Solicitar Pedido
          </button>
        </div>
      )}
    </aside>
  );
}
