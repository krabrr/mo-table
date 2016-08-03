const EDIT = 1, NEW = 2;
var rows, date, hn, op, df, wr, pn,
  backButton, nextButton, addButton,
  editButton, deleteButton, exportButton,
  addButtonBar, editButtonBar, xmlhttp, state;

window.onload = init();

function init() {
  date = document.getElementById("date");
  hn = document.getElementById("hn");
  op = document.getElementById("op");
  df = document.getElementById("df");
  wr = document.getElementById("wr");
  pn = document.getElementById("pn");
  editButton = document.getElementById("edit");
  deleteButton = document.getElementById("delete");
  exportButton = document.getElementById("export");
  addButtonBar = document.getElementById("add-bar");
  editButtonBar = document.getElementById("edit-bar");
  xmlhttp = new XMLHttpRequest("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      rows = JSON.parse(xmlhttp.responseText);
      validateView();
    }
  };
  xmlhttp.open("GET", "get-table.php", true);
  xmlhttp.send();
}

function validateView(idx=-1) {
  if (idx == -1) {
    if (rows && rows.length) {
      idx = rows.length;
    } else {
      rows = [];
      idx = 1;
    }
  }
  state = (rows.length < idx) ? EDIT : NEW;
  if (state == EDIT) {
    addButtonBar.style.display = "none";
    editButtonBar.style.display = "block";
  } else {
    reset();
    addButtonBar.style.display = "block";
    editButtonBar.style.display = "none";
  }
}

function back() {

}

function next() {

}

function add() {

}

function reset() {
  date.value = "";
  hn.value = "";
  op.value = "";
  df.value = "";
  wr.value = "";
  pn.value = "";
}

function edit() {

}

function delete() {

}

function export() {

}
