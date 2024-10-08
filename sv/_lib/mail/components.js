/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/




export function returnMailh2(head) {
    return ` <h3 style="  color: #000;
     font-size: 18.6px;
     font-weight: 600;
     margin: 0px;
     color: goldenrod;
     padding: 0px;
     text-transform: uppercase;
     font-family: Arial">   
     ${head}         
   </h3>`
   }
   
   
   export function returnMailParagraph(p) {
     return ` <p  class="main_text" 
     style=" 
     color: #666;
     width: 450px;
     text-wrap: wrap;
     margin: 0px;
     padding: 0px;
     font-family: Arial;
     text-align: center; "  >
   ${p}
   </p>`
    }
   
   
    export function returnMailTD2(feild,value) {
     return `
      <tr >
             <td 
             style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 13px 10px;
              background: inherit;
              text-wrap: wrap;"
              width="50%">${feild}</td>
             <td 
             style="
             text-transform: capitalize;
             border: 1px solid #dddddd;
             text-align: left;
             padding: 13px 10px;
             background: inherit;
             text-wrap: wrap;"
             width="50%"
             >${value}</td>
        </tr>
     `
    }

    export function returnMailTH2(feild,value) {
        return `
         <tr >
        <th
          style="border: 1px solid #ddd;
          text-align: left;
          padding: 13px 8px; 
          background-color:inherit;"
           width="50%" >
           ${feild}
          </th>
          <th 
          style="border: 1px solid #ddd;
          text-align: left;
          padding: 13px 8px; 
          background-color:inherit;"
          width="50%">${value}</th>
        </tr>
        `
       }