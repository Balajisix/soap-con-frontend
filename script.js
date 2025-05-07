document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('inputText');
  const invertBtn = document.getElementById('invertBtn');
  const outputText = document.getElementById('outputText');
  
  invertBtn.addEventListener('click', invertCase);
  
  inputText.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      invertCase();
    }
  });
  
  function invertCase() {
    const text = inputText.value;
    
    if (!text) {
      outputText.textContent = 'Please enter some text first!';
      outputText.style.color = '#d76d77';
      return;
    }
    
    outputText.textContent = 'Processing...';
    outputText.style.color = '#3a1c71';
    
    const soapRequest = `
   <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
     <soap:Body>
       <invertCase xmlns="http://www.examples.com/wsdl/CaseInversionService.wsdl">
         <input>${text}</input>
       </invertCase>
     </soap:Body>
   </soap:Envelope>`;

    fetch("http://localhost:8000/wsdl", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "invertCase",
      },
      body: soapRequest,
    })
      .then((response) => response.text())
      .then((responseText) => {
        console.log("SOAP Response:", responseText); 
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseText, "text/xml");
        
        const parserError = xmlDoc.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
          console.error("Error in XML parsing:", parserError[0].textContent);
          
          outputText.style.opacity = '0';
          setTimeout(() => {
            outputText.textContent = "Error in parsing SOAP response.";
            outputText.style.color = '#d76d77';
            outputText.style.opacity = '1';
          }, 200);
          return;
        }
        
        const resultNode = xmlDoc.getElementsByTagNameNS("http://www.examples.com/wsdl/CaseInversionService.wsdl", "result")[0];
        
        outputText.style.opacity = '0';
        setTimeout(() => {
          if (resultNode) {
            const result = resultNode.textContent;
            outputText.textContent = `Inverted: ${result}`;
            outputText.style.color = '#3a1c71';
          } else {
            console.error("Result node not found in response.");
            outputText.textContent = "Error: Result not found in response.";
            outputText.style.color = '#d76d77';
          }
          outputText.style.opacity = '1';
        }, 200);
      })
      .catch((error) => {
        console.error("SOAP Error:", error);
        
        outputText.style.opacity = '0';
        setTimeout(() => {
          outputText.textContent = "Error in SOAP request.";
          outputText.style.color = '#d76d77';
          outputText.style.opacity = '1';
        }, 200);
      });
  }
  
  inputText.addEventListener('focus', function() {
    this.placeholder = '';
  });
  
  inputText.addEventListener('blur', function() {
    if (!this.value) {
      this.placeholder = 'Enter text here...';
    }
  });
  
  invertBtn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.95)';
  });
  
  invertBtn.addEventListener('mouseup', function() {
    this.style.transform = '';
  });
  
  invertBtn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});