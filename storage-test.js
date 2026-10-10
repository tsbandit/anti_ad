(async() => {


const Global = window.Global = window.Global || {};

const {sleep} = Global.util;
const {create_api_caller} = Global.call_api;

//const compress_the_bible = async(directory) => {
//  const fs = require('fs');
//
//  const compress = (my_str) => {
//    return (async s => btoa(String.fromCharCode(...new Uint8Array(
//      await new Response(new Blob([s]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()
//    ))))(my_str);
//  };
//
//  const filenames = fs.readdirSync(directory);
//
//  const cache = {};
//  for(const filename of filenames) {
//    const compressed = await compress(fs.readFileSync(directory + filename));
//    cache[filename] = compressed;
//  }
//  fs.writeFileSync('./compressed_bible.json', JSON.stringify(cache));
//};

const decompress = (arg) => {
  return (async b64 => new TextDecoder().decode(await new Response(
    new Blob([Uint8Array.from(atob(b64), c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))
  ).arrayBuffer()))(arg);
};

const show_bible_verse = ({j, chapter_div, chapter_array}) => {
  const verse_text = chapter_array[j];

  const verse_div = document.createElement('div');
  verse_div.style.cssText = `\
    display: flex;
  `;

  const numeral_span = document.createElement('span');
  numeral_span.style.cssText = `\
    user-select: none;
    width: 25px;
    display: inline-block;
    flex-shrink: 0;
  `;
  numeral_span.innerText = (j + 1) + '';
  verse_div.appendChild(numeral_span)

  const text_span = document.createElement('span');
  text_span.innerText = verse_text;
  verse_div.appendChild(text_span)

  chapter_div.appendChild(verse_div);
};

const show_bible_chapter = ({i, book_div, cache, title_2}) => {
  const chapter_array = cache[i];

  const chapter_div = document.createElement('div');
  chapter_div.style.cssText = `\
    content-visibility: auto;
    contain-intrinsic-size: auto 200px;
  `;

  const chapter_title_div = document.createElement('div');
  chapter_title_div.innerText = title_2 + ' ' + (i + 1);
  chapter_div.appendChild(chapter_title_div);

  for(let j=0; j<chapter_array.length; ++j)
    show_bible_verse({j, chapter_div, chapter_array});

  book_div.appendChild(chapter_div);
};

const show_bible_book = (book_text) => {
  const array = book_text.trim().split('\n');
  const title_1 = array[0];
  let title_2 = null;
  const chapters = [];
  const cache = [];
  for(let i=0; i<array.length; ++i)
    if(array[i].startsWith('Chapter '))
      chapters.push(i);
  for(let i=array.length-1; i>=0; --i)
    if(chapters.includes(i + 1)) {
      cache.unshift(array.slice(i + 2));
      if(title_2 === null)
        title_2 = array[i].slice(0, -1);  // slice off the period
      array.splice(i);
    }
  if(array.length !== 0)
    throw new Error('unexpected condition RbJWrLlbihBWOerOOkZn');
  if(title_2 === null)
    throw new Error('unexpected condition IdCJhBKByoqrxgEHHZAD');

  const book_div = document.createElement('div');
  //book_div.style.cssText = `\
  //`;
  //book_div.innerText = title_2;

  for(let i=0; i<cache.length; ++i)
    show_bible_chapter({i, book_div, cache, title_2});

  document.body.appendChild(book_div);
};

const show_the_bible = async() => {
  const compressed_bible = await (await fetch('compressed_bible.json')).json();

  const bible_books = {};

  for(const filename in compressed_bible)
    bible_books[filename] = await decompress(compressed_bible[filename]);

  document.body.innerHTML = '';
  for(const book_text of Object.values(bible_books))
    show_bible_book(book_text);
};

const call_api = create_api_caller({
  url: 'http://localhost:3456/api',
  storage_key: 'api_key',
});

const main = async() => {
  await sleep(1000);
  const response = await call_api({type: 'ping'});
  console.log(response);

//  await show_the_bible();
};

main();


})();
