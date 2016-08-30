const EDIT = 1, NEW = 2;
var rows, date, hn, op, df, wr, pn,
  backButton, nextButton, addButton,
  editButton, deleteButton, exportButton,
  addButtonBar, editButtonBar, resetButton,
  xmlhttp, state, currentIdx, header;

window.addEventListener("DOMContentLoaded", init);

function init() {
  header = document.getElementById("header");
  date = document.getElementById("date");
  hn = document.getElementById("hn");
  op = document.getElementById("op");
  df = document.getElementById("df");
  wr = document.getElementById("wr");
  pn = document.getElementById("pn");
  backButton = document.getElementById("back");
  nextButton = document.getElementById("next");
  addButton = document.getElementById("add");
  resetButton = document.getElementById("reset");
  editButton = document.getElementById("edit");
  deleteButton = document.getElementById("delete");
  exportButton = document.getElementById("export");
  addButtonBar = document.getElementById("add-bar");
  editButtonBar = document.getElementById("edit-bar");

  backButton.onclick = back;
  nextButton.onclick = next;
  addButton.onclick = add;
  resetButton.onclick = reset;
  editButton.onclick = editCurrent;
  deleteButton.onclick = deleteCurrent;
  exportButton.onclick = exportTable;

  header.innerHTML = "Loading..."

  xmlhttp = new XMLHttpRequest("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText) {
        rows = JSON.parse(xmlhttp.responseText);
      }
      validateView(-1);
    }
  };
  xmlhttp.open("GET", "connect.php?command=get", true);
  xmlhttp.send();
}

function validateView(idx) {
  var row;
  if (rows && rows.length) {
    if (idx == -1 || idx > rows.length) {
      idx = rows.length + 1;
    }
  } else {
    rows = [];
    idx = 1;
  }
  currentIdx = idx;
  header.innerHTML = "Case No. " + currentIdx;
  state = (rows.length < idx) ? NEW : EDIT;
  if (state == EDIT) {
    addButtonBar.style.display = "none";
    editButtonBar.style.display = "block";
    row = rows[idx - 1];
    if (row) {
      date.value = row.date;
      hn.value = row.hn;
      op.value = row.op;
      df.value = row.df;
      wr.value = row.wr;
      pn.value = row.pn;
    }
    nextButton.removeAttribute("disabled");
  } else {
    reset();
    addButtonBar.style.display = "block";
    editButtonBar.style.display = "none";
    nextButton.setAttribute("disabled", "disabled");
  }

  if (idx == 1) {
    backButton.setAttribute("disabled", "disabled");
  } else {
    backButton.removeAttribute("disabled");
  }
}

function back() {
  validateView(currentIdx - 1)
}

function next() {
  validateView(currentIdx + 1)
}

function add() {
  var arr = [], info;
  arr.push("date=" + date.value);
  arr.push("hn=" + hn.value);
  arr.push("op=" + op.value);
  arr.push("df=" + df.value);
  arr.push("wr=" + wr.value);
  arr.push("pn=" + pn.value);
  info = arr.join("&");
  xmlhttp = new XMLHttpRequest("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText) {
        rows = JSON.parse(xmlhttp.responseText);
      }
      validateView(-1);
    }
  };
  xmlhttp.open("GET", "connect.php?command=add&" + info, true);
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
  var row = rows[currentIdx - 1];
  if (!row || !row.id) {
    return;
  }
  var arr = [], info;
  arr.push("date=" + date.value);
  arr.push("hn=" + hn.value);
  arr.push("op=" + op.value);
  arr.push("df=" + df.value);
  arr.push("wr=" + wr.value);
  arr.push("pn=" + pn.value);
  arr.push("id=" + row.id);
  info = arr.join("&");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText) {
        rows = JSON.parse(xmlhttp.responseText);
      }
      validateView(currentIdx);
    }
  };
  xmlhttp.open("GET", "connect.php?command=edit&" + info, true);
  xmlhttp.send();
}

function deleteCurrent() {
  var row = rows[currentIdx - 1];
  if (!row || !row.id) {
    return;
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText) {
        rows = JSON.parse(xmlhttp.responseText);
      }
      validateView(currentIdx);
    }
  };
  xmlhttp.open("GET", "connect.php?command=delete&id=" + row.id, true);
  xmlhttp.send();
}

function exportTable() {
  var i, row, date_str;
  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    date_str = row.date;
    console.log(date_str);
  }
  /*var element = document.createElement("a");
  element.setAttribute('href', 'connect.php?command=download');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);*/
}
