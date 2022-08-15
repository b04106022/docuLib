import {data, renderData} from 'test.js'

$(document).ready(function(){
    $('#p2').html('blahblah');

    $('button').click(function(){
        let arr = ['1, ','2, ']
        console.log('arr:');
        console.log(arr);


        data.push(...arr)
        console.log('data:');
        console.log(data);
    });
});