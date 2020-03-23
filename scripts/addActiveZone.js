// let divRGB = document.createElement('div');
//     divRGB.className = 'divRGB';

let activeZones = document.querySelector('.activeZones');
console.log(activeZones);
 let i=0;
let BtnAddActiveZone = document.querySelector('.addActiveZone');
// console.log(addActiveZone);

    BtnAddActiveZone.addEventListener('click', () => {
        i++;
        let divRGB = document.createElement('div');
        divRGB.className = 'divRGB';
        divRGB.innerHTML= `<abbr title="Red color">R = </abbr><input type="number" value="0" min="0" max="255" name="R${i}">
                            <abbr title="Green color">G = </abbr><input type="number" value="0" min="0" max="255"  name="G${i}">
                            <abbr title="Blue color">B = </abbr><input type="number" value="0" min="0" max="255"  name="B${i}"> <br><br>`;
        console.log(divRGB);
        activeZones.appendChild(divRGB);
    });

