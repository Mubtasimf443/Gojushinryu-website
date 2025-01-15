# String Player 
<p>It Helps You To play with string and transform strings what are use in lots of cases of node.js application</p>


#### There are various string Manipulation function and class what Can yuo use
***LIKE:-***
```
import { log, MakePriceString, mekeLinkString,GenerateOTP,repleCaracter } from "string-player"
```



#### functionality of GenerateOTP Class
by default it return 6 charecters unique otp each time
```
import {GenerateOTP,log} from 'string-player'

let otp=new GenerateOTP();

log(otp.getPin())//returns 271633
log(otp.getPin())//returns 474316
log(otp.getPin())//returns 706210
```

_You can get opt of more or lest Carecter :-_
```
import {GenerateOTP,log} from 'string-player'

let less=new GenerateOTP(4);// 4 Charecters 
let more=new GenerateOTP(9);// 9 Charecters 


let opt_of_4_charecters=less.getPin() //return unique value like 7927
let opt_of_9_charecters=more.getPin();//return unique value like 640821514;


console.log({opt_of_4_charecters,opt_of_9_charecters});
//prints
// { opt_of_4_charecters: 7927,opt_of_9_charecters: 640821514 }

```


#### functionality of repleCaracter 
```
import { log, repleCaracter } from "string-player"


log(repleCaracter(`
export function checkTimeString(time) {
    if (typeof time != 'string') throw 'not a correct time ' + time
    if (!time.includes(':')) throw 'not a correct time ' + time
    if (time.length !== 5) throw 'not a correct time ' + time
    time = time.split(':')
    if (time.length !== 2) throw 'not a correct time array'
    if (Number(time[0]).toString().toLowerCase == 'nan') throw 'not a correct time[0] ' + time[0]
    if (Number(time[1]).toString().toLowerCase == 'nan') throw 'not a correct time[1] ' + time[1]
    if (time[0] < 0 || time[0] > 23) throw 'not a correct time[1] ' + time[0]
    if (time[1] < 0 || time[1] > 59) throw 'not a correct time[1] ' + time[1]
    // log( time[0] > 11 ? Number(time[0]) - 11 : time[0])
    let string = (time[0] > 12 ? Number(time[0]) - 12 : time[0]) + ':' + time[1] + ' ' + (time[0] > 11 ? 'PM' : 'AM');
    return string
}`
))

```


prints 
```
export function checkTimeString&#40;time&#41; &#123;
    if &#40;typeof time != &#39;string&#39;&#41; throw &#39;not a correct time &#39; + time
    if &#40;!time.includes&#40;&#39;:&#39;&#41;&#41; throw &#39;not a correct time &#39; + time
    if &#40;time.length !== 5&#41; throw &#39;not a correct time &#39; + time
    time = time.split&#40;&#39;:&#39;&#41;
    if &#40;time.length !== 2&#41; throw &#39;not a correct time array&#39;
    if &#40;Number&#40;time&#91;0&#93;&#41;.toString&#40;&#41;.toLowerCase == &#39;nan&#39;&#41; throw &#39;not a correct time&#91;0&#93; &#39; + time&#91;0&#93;
    if &#40;Number&#40;time&#91;1&#93;&#41;.toString&#40;&#41;.toLowerCase == &#39;nan&#39;&#41; throw &#39;not a correct time&#91;1&#93; &#39; + time&#91;1&#93;
    if &#40;time&#91;0&#93; < 0 || time&#91;0&#93; > 23&#41; throw &#39;not a correct time&#91;1&#93; &#39; + time&#91;0&#93;      
    if &#40;time&#91;1&#93; < 0 || time&#91;1&#93; > 59&#41; throw &#39;not a correct time&#91;1&#93; &#39; + time&#91;1&#93;      
    // log&#40; time&#91;0&#93; > 11 ? Number&#40;time&#91;0&#93;&#41; - 11 : time&#91;0&#93;&#41;
    let string = &#40;time&#91;0&#93; > 12 ? Number&#40;time&#91;0&#93;&#41; - 12 : time&#91;0&#93;&#41; + &#39;:&#39; + time&#91;1&#93; + &#39; &#39; + &#40;time&#91;0&#93; > 11 ? &#39;PM&#39; : &#39;AM&#39;&#41;;
    return string
&#125;
```



#### functionality of MakePriceString

```
import { log,  MakePriceString} from "string-player"

let a = 500;
a=await MakePriceString(a);
log(a)

//returns  500.00
```

#### functionality of mekeLinkString

```
import { log, mekeLinkString } from "string-player"

let a = 'https://www.your-website.com/a b c d f g e l k p n m o k j l i p q r s';

log(mekeLinkString(a))
//prints https://www.your-website.com/a-b-c-d-f-g-e-l-k-p-n-m-o-k-j-l-i-p-q-r-s

```

#### functionality of makeUrlWithParams
```
let reqData={
    command :'INIT',
    total_bytes:10240
} 
log(makeUrlWithParams('https://upload.twitter.com/1.1/media/upload.json',reqData))
//returns 'https://upload.twitter.com/1.1/media/upload.json?command=INIT&total_bytes=10240
```
#### functionality of breakJsonData
```
import { breakJsonData, log } from "./index.js"

let data=JSON.stringify({
    A:'A',
    B:'B',
    C:'C',
    D:'D',
    bol:true,
    fool:false,
    arr:["alert","WebTransport","wet"],
    e:"we"
})

log(data);
//prints
//{"A":"A","B":"B","C":"C","D":"D","bol":true,"fool":false,"arr":["alert","WebTransport","wet"],"e":"we"}


data= breakJsonData(data)
log(data);

//prints
// {
//     "A":"A",
//     "B":"B",
//     "C":"C",
//     "D":"D",
//     "bol":true,
//     "fool":false,
//     "arr":[
//     "alert",
//     "WebTransport",
//     "wet"
//     ],
//     "e":"we"
// }


```

##### From string-player@1.0.6 you can parse object on breckjsondata 

```
import { breakJsonData, log } from "./index.js"


let data = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10
}

log(data);

/* 
it prints
{
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10
}
    
*/
```


***You can contribute also by joining github-***<a href="https://github.com/Mubtasimf443/string-player">github Repository</a>



### use of Validator
```
import Validator from "./_lib/Validator.js";

let validate=new Validator({giveError:false});

console.log(validate.isAllEmty(['e','',null,undefined]));
//prints false 


console.log(validate.isAllEmty(['',null,undefined]));
//prints true
```


#### check email

```


import Validator from "./_lib/Validator.js";

let isEmail = val => (new Validator()).isEmail(val);
console.log(isEmail('mubtasim@gmail.com'));
//prints true;

console.log(isEmail('$mubtasim@gmail.com'));
//prints false;

console.log(isEmail('mubtasim@gmail..com'));
//prints false;

console.log(isEmail('mubtasim@@gmail.com'));
//prints false;

console.log(isEmail('mubtasim@gmail.c'));
//prints false;


console.log(isEmail('mubtasim@gmail.cm'));
//prints true;

console.log(isEmail('mubtasim@gmai,l.com'));
//prints false;

console.log(isEmail('[mubtasim@gmail.com]'));
//prints false;

console.log(isEmail('1mubtasim@gmail.com'));
//prints false;
```



<br>

## Your Support will inspire me to create better packages for You

<br>

***Follow Me ***

<ol>
<li><a href="https://github.com/Mubtasimf443">Github Profile</a></li>
<li><a href="https://x.com/MubtasimFu11492">X twitter</a></li>
<li><a href="https://web.facebook.com/muhammadmubtasimf">Facebook</a></li>
<li><a href="https://www.upwork.com/freelancers/~01d88c06387ca7603a">Upwork</a></li>
<li><a href="tel:+8801750147694">+8801750147694</a></li>
<li><a>Location : Anowara , Chittagong , Bangladesh</a></li>
</ol>



