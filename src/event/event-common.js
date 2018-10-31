
var isOpen = (self) => {
  return !self.private;
}
var isKanji = (self) => {
  return self.kanji.find(member => { return member === self.user.uid; });
}
var canEdit = (self) => {
  return isKanji(self) || isOpen(self);
}
var noPermission = () => {
  console.log("you are not kanji");
}

const common = {};

common.canEdit = canEdit
common.isKanji = isKanji
common.isOpen = isOpen
common.noPermission = noPermission

export default common;