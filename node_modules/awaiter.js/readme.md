# npm Awaiter.js 
<p> this npm package is stop the javascript code execution </p>

## Awaiter
```
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import Awaiter from "Awaiter.js";

await Awaiter(1000)
//It will stop the node.js code for 1000 mili seconds or 1 seconds
await Awaiter(3000)
//It will stop the node.js code for 3000 mili seconds or 3 seconds
await Awaiter(5000)
//It will stop the node.js code for 5000 mili seconds or 5 seconds
```

## waidTillFileLoad
<b>waidTillFileLoad</b> is use for waiting the file is saved to the storage 
```
import { fileURLToPath } from "url";
import { waidTillFileLoad } from "./index.js";
import path, { dirname, resolve } from 'path'
let __dirname=dirname(fileURLToPath(import.meta.url))

await waidTillFileLoad({
    filePath:resolve(__dirname, './readme.md'),
    //thid the path , where file will be stored
    checkingTime:1000,
    //check after 1seconds , by default waidTillFileLoad check after every 0.05s seconds
    maxWaitTime:8000,
    //the max waiting time for the file to be loaded , by default it waits for 10 secods
});


```
