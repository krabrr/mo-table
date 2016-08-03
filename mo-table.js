const EDIT = 1, NEW = 2;
var rows, date, hn, op, df, wr, pn,
  backButton, nextButton, addButton,
  editButton, deleteButton, exportButton,
  addButtonBar, editButtonBar, xmlhttp, state;

window.addEventListener("DOMContentLoaded", init);

function init() {
  date = document.getElementById("date");
  hn = document.getElementById("hn");
  op = document.getElementById("op");
  df = document.getElementById("df");
  wr = document.getElementById("wr");
  pn = document.getElementById("pn");
  backButton = document.getElementById("back");
  nextButton = document.getElementById("next");
  addButton = document.getElementById("add");
  editButton = document.getElementById("edit");
  deleteButton = document.getElementById("delete");
  exportButton = document.getElementById("export");
  addButtonBar = document.getElementById("add-bar");
  editButtonBar = document.getElementById("edit-bar");

  backButton.onclick = back;
  nextButton.onclick = next;
  addButton.onclick = add;
  editButton.onclick = editCurrent;
  deleteButton.onclick = deleteCurrent;
  exportButton.onclick = exportTable;

  xmlhttp = new XMLHttpRequest("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      rows = JSON.parse(xmlhttp.responseText);
      validateView();
    }
  };
  xmlhttp.open("GET", "connect.php", true);
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
  alert("add");
  var arr = [], info;
  arr.push("date=" + date.value);
  arr.push("hn=" + hn.value);
  arr.push("op=" + op.value);
  arr.push("df=" + df.value);
  arr.push("wr=" + wr.value);
  arr.push("pn=" + pn.value);
  info = arr.join(",");
  xmlhttp = new XMLHttpRequest("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      alert(xmlhttp.responseText);
      rows = JSON.parse(xmlhttp.responseText);
      validateView();
    }
  };
  xmlhttp.open("GET", "connect.php?" + info, true);
  xmlhttp.send();
}

function reset() {
  date.value = "";
  hn.value = "";
  op.value = "";
  df.value = "";
  wr.value = "";
  pn.value = "";
}

function editCurrent() {

}

function deleteCurrent() {

}

function exportTable() {

}
