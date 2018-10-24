const handleImage = ( file, max = 480, func ) =>{
  let reader = new FileReader();

  // 写真のEXIF情報のOrientationを取得
  let orientation = 1;
  EXIF.getData( file, () => {
    orientation = EXIF.getTag(file, 'Orientation');
    if( !orientation ){
      return;
    }
  });

  reader.onload = ( readerEvent ) => {
    let image = new Image();
    image.onload = () => {
      // Resize the image
      let canvas = document.createElement( 'canvas' );
      let width = image.width;
      let height = image.height;
      // 圧縮のためmaxに合わせてリサイズ
      if ( width > height ) {
        if ( width > max ) {
          height *= max / width
          width = max
        }
      } else {
        if ( height > max ) {
          width *= max / height
          height = max
        }
      }

      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext( '2d' );
      ctx.save();

      // 写真のEXIF情報のOrientationに基づいて回転させる
      let rotate = 0;
      let wmove = 0;
      let hmove = 0;
      switch ( orientation ) {
        case 3:
          rotate = 180;
          wmove = -width;
          hmove = -height;
          break;
        case 6:
          rotate = 90;
          wmove = 0;
          hmove = -width;
          break;
        case 8:
          rotate = -90;
          wmove = -height;
          hmove = 0;
          break;
      }
      ctx.rotate( rotate * Math.PI / 180 );
      ctx.translate( wmove, hmove );
      ctx.drawImage( image, 0, 0, width, height );
      ctx.restore();
      func( canvas.toDataURL( 'image/png' ) );
    }
    image.src = readerEvent.target.result;
  }
  if (file) {
    reader.readAsDataURL(file);
  }
}
export default handleImage
