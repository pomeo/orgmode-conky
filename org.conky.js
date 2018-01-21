const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('/dir/to/your/file.org')
});

let trigger = true;
let last = true;

function notShow(line) {
  [
      /:LOGBOOK:/g,
      /:END:/g
  ].some((regexp) => {
    if (regexp.test(line)) {
      trigger = !trigger;
      last = false;
    } else {
      last = true;
    }
  });
}

const colors = [
  {
    pattern: /(TODO)/g,
    color: '#ffaa88'
  },
  {
    pattern: /(DONE)/g,
    color: '#aaff88'
  },
  {
    pattern: /(CLOSED)/g,
    color: '#0295a9'
  },
  {
    pattern: /(DEADLINE)/g,
    color: '#FF6F69'
  },
  {
    pattern: /(SCHEDULED)/g,
    color: '#f8e2a8'
  }
]

function colorize(line) {
  const match = colors.find((obj) => {
    return obj.pattern.test(line);
  });
  if (match) {
    return line.replace(match.pattern, '${color ' + match.color + '}$1${color}')
  } else {
    return line;
  }
}

lineReader.on('line', (line) => {
  notShow(line);
  if (trigger && last) {
    console.log(colorize(line));
  }
});
