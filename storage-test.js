(async() => {


const compressed_bible = await (await fetch('compressed_bible.json')).json();
const response = await (await fetch('http://localhost:3456/ping')).json();

const decompress = (arg) => {
  return (async b64 => new TextDecoder().decode(await new Response(
    new Blob([Uint8Array.from(atob(b64), c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))
  ).arrayBuffer()))(arg);
};

const bible_books = {};

for(const filename in compressed_bible)
  bible_books[filename] = await decompress(compressed_bible[filename]);

console.log({response, bible_books});

document.body.innerHTML = '';
for(const book_text of Object.values(bible_books)) {
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

  const div = document.createElement('div');
//  div.style.cssText = `\
//  `;
//  div.innerText = title_2;

  for(let i=0; i<cache.length; ++i) {
    const chapter_array = cache[i];

    const chapter_div = document.createElement('div');
    chapter_div.style.cssText = `\
      content-visibility: auto;
      contain-intrinsic-size: auto 200px;
    `;

    const chapter_title_div = document.createElement('div');
    chapter_title_div.innerText = title_2 + ' ' + (i + 1);
    chapter_div.appendChild(chapter_title_div);

    for(let j=0; j<chapter_array.length; ++j) {
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
    }

    div.appendChild(chapter_div);
  }

  document.body.appendChild(div);
}


})();
