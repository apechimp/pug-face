var querystring = require('querystring');
var hyperquest = require('hyperquest');
var bl = require('bl');
var async = require('async');
var to_array = require('to-array');
var xtend = require('xtend');
var pick = require('lodash.pick');

function generate_position(face) {
  var img_width = face.img_width;
  var img_height = face.img_height;
  var width = face.position.width * .01 * img_width;
  var height = face.position.height * .01 * img_height;
  var center_x = face.position.center.x * .01 * img_width;
  var center_y = face.position.center.y * .01 * img_height;

  return {
    width: width,
    height: height,
    top: center_y - height / 2,
    left: center_x - width / 2
  }
}

function place_pug(img, faces) {
  var div = document.createElement('div');
  div.style.position = 'relative';
  div.style.display = 'inline';
  div.appendChild(img);

  faces.face.forEach(function(face) {
    var position = generate_position(
      xtend(face, pick(faces, 'img_width', 'img_height'))
    );
    var pug = document.createElement('img');
    var roll = face.attribute.pose.roll_angle.value;
    pug.style.position = 'absolute';
    pug.style.width = position.width;
    pug.style.height = position.height;
    pug.style.top = position.top;
    pug.style.left = position.left;
    pug.style.transform = 'rotate('+roll+'deg)';
    pug.src = '/pug-face.png';

    div.appendChild(pug);
  });
  document.body.appendChild(div);
}

function get_faces(img_url, cb) {
  var qs = querystring.stringify({
    url: img_url,
    mode: 'normal',
    api_key: '4571281cef0e8bb9f09b51435e767d9c',
    api_secret: 'OWwpfDvlLF1AAOGGbwSEcnkDdZrikNkL',
    attribute: 'pose'
  });

  hyperquest.get(
    'https://apius.faceplusplus.com/v2/detection/detect?'+qs,
    {
      withCredentials: false
    }
  ).
  pipe(bl(function(err, buff) {
    if(err) { cb(err) }
    else {
      var body = buff.toString();
      var faces = JSON.parse(body);
      cb(null, faces);
    }
  }));
}

console.log('bam')
var images = to_array(document.images);

images.forEach(function(image) {
  get_faces(image.src, function(err, faces) {
    if(err) { console.err(err); }
    else { place_pug(image, faces); }
  });
});
