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
  goto = document.getElementById("goto");
  goButton = document.getElementById("go")
  backButton = document.getElementById("back");
  nextButton = document.getElementById("next");
  addButton = document.getElementById("add");
  resetButton = document.getElementById("reset");
  editButton = document.getElementById("edit");
  deleteButton = document.getElementById("delete");
  exportButton = document.getElementById("export");
  addButtonBar = document.getElementById("add-bar");
  editButtonBar = document.getElementById("edit-bar");

  goButton.onclick = go;
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

function go() {
  var idx = -1, target = goto.value;
  if (!target) return;
  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    date_str = row.date;
    if (date_str == target) {
      idx = i + 1;
      break;
    }
  }
  validateView(idx)
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
  var i, row, date_str, date_obj, month, year, text, ul, li, n, already = {},
    texts = [], monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    date_str = row.date;
    date_obj = new Date(date_str);
    month = date_obj.getMonth() + 1;
    year = date_obj.getFullYear();
    text = month + " " + year;
    if (!already[text]) {
      texts.push({month: month, year: year});
      already[text] = true;
    }
  }

  texts.sort(compareYear);

  if (!texts.length) return;
  ul = document.getElementById("month-selector");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  for (i = 0; i < texts.length; i++) {
    li = document.createElement("li");
    li.setAttribute("month", String(texts[i].month));
    li.setAttribute("year", String(texts[i].year));
    li.onclick = monthSelectedHandler;
    n = document.createTextNode(monthNames[texts[i].month-1] + " " + texts[i].year);
    li.appendChild(n);
    ul.appendChild(li);
  }

  function monthSelectedHandler(event) {
    li = event.target;
    if (!li) return;
    var element = document.createElement("a");
    element.setAttribute('href', 'connect.php?command=download&month='+li.getAttribute("month").toString()+'&year='+li.getAttribute("year").toString());
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function compareYear(a, b) {
    if (a.year < b.year)
      return -1;
    if (a.year > b.year)
      return 1;
    return 0;
  }
  /*var element = document.createElement("a");
  element.setAttribute('href', 'connect.php?command=download');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);*/
}
