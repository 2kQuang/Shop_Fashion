<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SCSS Analyze Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      color-scheme: dark;
    }

    body {
      background: #0f171c;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    table {
      border-collapse: collapse;
    }

    .container {
      margin: 0 auto;
      padding: 40px 20px calc(30vh + 40px);
      max-width: 1300px;
    }

    h1,
    h2,
    h3,
    h4 {
      margin-bottom: 1em;
    }

    code,
    pre {
      font-family: ui-monospace, monospace;
    }

    .hidden {
      display: none;
    }

    .mb-1 {
      margin-bottom: 1em;
    }

    .mb-2 {
      margin-bottom: 2em;
    }

    .mb-3 {
      margin-bottom: 3em;
    }

    .mb-4 {
      margin-bottom: 4em;
    }

    .mb-5 {
      margin-bottom: 5em;
    }

    .analyzed-time {
      margin-bottom: 40px;
    }

    .link-inspect {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .btn {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }

    .btn-filter {
      margin-top: 20px;
    }

    .panel {
      margin: 20px 0 40px;
      padding: 20px;
      background-color: #18232a;
    }

    .table-data {
      width: 100%;
    }

    .table-data tr:nth-of-type(odd) {
      background-color: #1f2b32;
    }

    .table-data th,
    .table-data td {
      padding: 10px 20px;
      text-align: left;
    }

    .table-data th:nth-child(1) {
      width: 100px;
    }

    .table-data th:nth-child(2) {
      width: 100%;
    }

    .table-data th:nth-child(3) {
      min-width: 200px;
    }

    .table-data td:nth-child(1) {
      white-space: nowrap;
    }

    .table-data td {
      font-family: ui-monospace, monospace;
      color: #ccc;
    }

    .table-inspect {
      width: 100%;
    }

    .table-inspect tr:nth-child(odd) {
      background-color: #1f2b32;
    }

    .table-inspect th,
    .table-inspect td {
      padding: 10px 20px;
      text-align: left;
      border: 1px solid #2b393f;
    }

    .table-inspect th:nth-child(1) {
      width: 50%;
    }

    .table-inspect th:nth-child(2) {
      width: 100px;
    }

    .table-inspect th:nth-child(3) {
      width: calc(50% - 100px);
    }

    .table-inspect td {
      font-family: ui-monospace, monospace;
      color: #ccc;
    }

    .table-inspect td a {
      color: inherit;
      text-decoration: underline;
    }

    .devtool {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #18232a;
      opacity: 0;
      visibility: hidden
    }

    .devtool.is-open {
      opacity: 1;
      visibility: visible;
    }

    .devtool-header {
      height: 36px;
      padding: 10px 20px;
      border-top: 1px solid #394d55;
      border-bottom: 1px solid #394d55;
      position: relative;
    }

    .devtool-main {
      height: 30vh;
      padding: 20px;
      overflow: auto;
    }

    .btn-close-devtool {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 34px;
      height: 34px;
      padding: 0;
      margin: 0;
      -webkit-appearance: none;
      outline: none;
      border: none;
      position: absolute;
      top: 0;
      right: 0;
      background: transparent;
      cursor: pointer;
    }

    .btn-close-devtool:hover {
      background: #394d55;
    }

    .btn-close-devtool svg {
      fill: #f8f8f8;
    }

    .color-tile {
      display: inline-block;
      width: 1em;
      height: 1em;
      margin-right: .5em;
      margin-top: -.2em;
      vertical-align: middle;
    }

    .panel-tab-header {
      padding: 10px 0 0 20px;
      margin-bottom: 20px;
      border: 1px solid #2b393f;
    }

    .panel-tab-header label {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .panel-tab-header label input {
      display: inline-block;
      vertical-align: middle;
      margin-right: .3em;
      cursor: pointer;
    }

    .panel-tab-header label span {
      display: inline-block;
      vertical-align: middle;
      color: #cdd3d6;
    }

    .filter-media-queries {
      margin: 0;
    }
    .filter-media-queries label {
      display: block;
    }

    .navigation {
      display: none;
      position: fixed;
      top: 0;
      left: 50%;
      z-index: 1000;
      width: 200px;
      height: 100vh;
      padding: 30px 0;
      margin-left: 540px;
    }

    .navigation .nav-title {
      color: #f8f8f8;
      font-size: 18px;
      font-weight: 700;
    }

    .navigation .nav-list {
      padding-left: 5px;
    }

    .navigation .nav-list li {
      list-style-position: inside;
    }

    .navigation .nav-list li:not(:first-child) {
      margin-top: 0.5em;
    }

    .navigation .nav-list li a {
      color: #cdd3d6;
      text-decoration: none;
    }

    .navigation .nav-list li a:hover {
      color: #fff;
    }

    @media (min-width: 1500px) {
      .navigation {
        display: block;
      }
      .container {
        position: relative;
        left: -100px;
      }
    }

  </style>
</head>

<body>
  <div class="container" id="container">
    <h1>SCSS Analyze Report</h1>
    <div class="analyzed-time">Analyzed time: <time id="analyzed-time"></time></div>
  </div>

  <div class="devtool">
    <div class="devtool-header">
      <button type="button" class="btn-close-devtool" onClick="closeDevTool();">
        <svg width="12" height="12" viewBox="0 0 24 24" class="inline-block fill-current ">
          <path
            d="m23 20.168-8.185-8.187L23 3.807 20.168 1l-8.182 8.179L3.81 1 1 3.81l8.186 8.196L1 20.19 3.81 23l8.203-8.192L20.193 23z">
          </path>
        </svg>
      </button>
    </div>
    <div class="devtool-main"></div>
  </div>
  <script>

    const dataObject = {/* DATA_PLACEHOLDER */};

    const openDevTool = () => {
      const devTool = document.querySelector('.devtool');
      if (devTool) {
        devTool.classList.add('is-open');
      }
    };

    const closeDevTool = () => {
      const devTool = document.querySelector('.devtool');
      if (devTool) {
        devTool.classList.remove('is-open');
      }
    };

    const loadDevToolData = (type, prop, value) => {
      const devToolMainEl = document.querySelector('.devtool-main');
      if (devToolMainEl) {
        devToolMainEl.innerHTML = '';
      }
      const data = dataObject[type];
      if (data?.length) {
        const sortedData = data.sort((a, b) => a.fileName.localeCompare(b.fileName));
        const filteredData = sortedData.filter(item => item.property === decodeURIComponent(prop) && item.value === decodeURIComponent(value));

        const table = document.createElement('table');
        table.className = 'table-inspect';

        const headers = ['File', 'Line', 'Selector'];
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        filteredData.forEach(entry => {
          const { fileName, filePath, column, line, selectorClasses } = entry;
          const tr = document.createElement('tr');
          const fileCell = document.createElement('td');
          const lineCell = document.createElement('td');
          const classCell = document.createElement('td');
          fileCell.innerHTML = `<code>${fileName}</code>`;
          lineCell.innerHTML = `<a href="file://${filePath}#${line}:${column}">${line}:${column}</a>`;
          classCell.innerHTML = `<pre>${selectorClasses}</pre>`;
          tr.appendChild(fileCell);
          tr.appendChild(lineCell);
          tr.appendChild(classCell);
          table.appendChild(tr);
        });
        devToolMainEl.appendChild(table);
      }
    };

    const initNavigation = () => {
      const body = document.querySelector('body');

      const navigation = document.createElement('div');
      navigation.className = 'navigation';

      const navTitle = document.createElement('h2');
      navTitle.className = 'nav-title';
      navTitle.textContent = 'Navigate this page';
      navigation.appendChild(navTitle);

      const navList = document.createElement('ul');
      navList.className = 'nav-list';
      navigation.appendChild(navList);

      const headings = document.querySelectorAll('#container h2');
      headings.forEach((h2) => {
        const id = h2.textContent.replace(/\s+/g, '-').toLowerCase();
        h2.setAttribute('id', id);
        const navItem = document.createElement('li');
        const navLink = document.createElement('a');
        navLink.href = `#${id}`;
        navLink.textContent = h2.textContent;
        navItem.appendChild(navLink);
        navList.appendChild(navItem);
      });

      body.appendChild(navigation);
    };

    const initLinkInspect = () => {
      const linkInspects = document.querySelectorAll('.link-inspect');
      linkInspects.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const el = event.currentTarget;
          const type = el.getAttribute('data-type');
          const prop = el.getAttribute('data-prop');
          const value = el.getAttribute('data-value');
          loadDevToolData(type, prop, value);
          openDevTool();
        });
      });
    };

    const initFilter = () => {
      const filterRadios = document.querySelectorAll('.panel-tab-header input[type="radio"]');
      filterRadios.forEach((radio) => {
        radio.addEventListener('change', (event) => {
          event.preventDefault();
          const el = event.currentTarget;
          const selectedProp = el.value;
          const dataTable = el.closest('.panel-tab-header').parentElement.querySelector('.table-data');
          const tableRows = dataTable.querySelectorAll('tr:not(:first-child)');
          tableRows.forEach(function(row) {
            const filterAttribute = row.getAttribute('filter');
            if (selectedProp === 'all' || selectedProp === filterAttribute) {
              row.classList.remove('hidden');
            } else {
              row.classList.add('hidden');
            }
          });
          const visibleRows = dataTable.querySelectorAll('tr:not(:first-child):not(.hidden)');
          for (let i = 0; i < visibleRows.length; i++) {
            const row = visibleRows[i];
            row.style.backgroundColor = 'transparent';
            if (i % 2 === 0) {
              row.style.backgroundColor = 'transparent';
            } else {
              row.style.backgroundColor = '#1f2b32';
            }
          }
        });
      });
    };

    const showMediaOptions = () => {
      const container = document.querySelector('#container');

      const headingEl = document.createElement('h2');
      headingEl.textContent = 'Media Queries';
      container.appendChild(headingEl);

      const panelEl = document.createElement('div');
      panelEl.className = 'panel';

      const data = dataObject['mediaQueries'];
      if (!data?.length) {
        const p = document.createElement('p');
        p.textContent = 'No data';
        panelEl.appendChild(p);
        container.appendChild(panelEl);
        return;
      };

      const p = document.createElement('p');
      p.className = 'mb-1';
      p.textContent = 'You can filter the analyze result according to the selected media queries. Entries without media queries will be displayed always.';

      panelEl.appendChild(p);

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const filterValue = urlParams.get('filter');
      let filterArray = [];
      let filterQueries = [];
      if (filterValue) {
        filterArray = filterValue.split(',');
        filterQueries = filterArray.map(index => dataObject.mediaQueries[parseInt(index, 10)]);
        if (filterQueries.length) {
          dataObject.importantUsages = dataObject.importantUsages.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.colorValues = dataObject.colorValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.fontfamilyValues = dataObject.fontfamilyValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.fontsizeValues = dataObject.fontsizeValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.fontweightValues = dataObject.fontweightValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.lineheightValues = dataObject.lineheightValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.widthValues = dataObject.widthValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.heightValues = dataObject.heightValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.marginValues = dataObject.marginValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.paddingValues = dataObject.paddingValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.textshadowValues = dataObject.textshadowValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.boxshadowValues = dataObject.boxshadowValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.topValues = dataObject.topValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.rightValues = dataObject.rightValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.bottomValues = dataObject.bottomValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
          dataObject.leftValues = dataObject.leftValues.filter(item => item.mediaQuery === null || filterQueries.includes(item.mediaQuery));
        } else if (filterValue === '') {
          dataObject.importantUsages = dataObject.importantUsages.filter(item => item.mediaQuery === null);
          dataObject.colorValues = dataObject.colorValues.filter(item => item.mediaQuery === null);
          dataObject.fontfamilyValues = dataObject.fontfamilyValues.filter(item => item.mediaQuery === null);
          dataObject.fontsizeValues = dataObject.fontsizeValues.filter(item => item.mediaQuery === null);
          dataObject.fontweightValues = dataObject.fontweightValues.filter(item => item.mediaQuery === null);
          dataObject.lineheightValues = dataObject.lineheightValues.filter(item => item.mediaQuery === null);
          dataObject.widthValues = dataObject.widthValues.filter(item => item.mediaQuery === null);
          dataObject.heightValues = dataObject.heightValues.filter(item => item.mediaQuery === null);
          dataObject.marginValues = dataObject.marginValues.filter(item => item.mediaQuery === null);
          dataObject.paddingValues = dataObject.paddingValues.filter(item => item.mediaQuery === null);
          dataObject.textshadowValues = dataObject.textshadowValues.filter(item => item.mediaQuery === null);
          dataObject.boxshadowValues = dataObject.boxshadowValues.filter(item => item.mediaQuery === null);
          dataObject.topValues = dataObject.topValues.filter(item => item.mediaQuery === null);
          dataObject.rightValues = dataObject.rightValues.filter(item => item.mediaQuery === null);
          dataObject.bottomValues = dataObject.bottomValues.filter(item => item.mediaQuery === null);
          dataObject.leftValues = dataObject.leftValues.filter(item => item.mediaQuery === null);
        }
      }

      if (dataObject.mediaQueries) {
        const filterEl = document.createElement('div');
        filterEl.className = 'panel-tab-header filter-media-queries';
        dataObject.mediaQueries.forEach((item, index) => {
          const label = document.createElement('label');
          const input = document.createElement('input');
          const span = document.createElement('span');
          input.type = 'checkbox';
          input.name = `filter-media-queries`;
          input.value = index;

          if (filterArray.length) {
            if (filterArray.includes(index.toString())) {
              input.checked = true;
            } else {
              input.checked = false;
            }
          } else {
            if (filterValue === null) {
              // If no ?filter
              input.checked = true;
            } else {
              // If ?filter=
              input.checked = false;
            }
          }

          span.textContent = item;
          label.appendChild(input);
          label.appendChild(span);
          filterEl.appendChild(label);
        });
        panelEl.appendChild(filterEl);
      }

      const button = document.createElement('button');
      button.className = 'btn btn-filter';
      button.textContent = 'Filter';
      panelEl.appendChild(button);

      container.appendChild(panelEl);

      const btnFilter = document.querySelector('.btn-filter');
      btnFilter.addEventListener('click', (event) => {
        event.preventDefault();
        const checkboxes = document.querySelectorAll('input[name="filter-media-queries"]');
        const checkedCheckboxes = document.querySelectorAll('input[name="filter-media-queries"]:checked');
        const filterValues = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
        const currentFilename = window.location.pathname.split('/').pop();
        if (filterValues.length === checkboxes.length) {
          window.location.href = currentFilename;
        } else {
          window.location.href = currentFilename + '?filter=' + filterValues.join(',');
        }
      });

    }

    const getDateTime = (time) => {
      const now = new Date(time);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDateTime;
    }

    const showAnalyzedTime = () => {
      if (dataObject.analyzedTime) {
        const formatedTime = getDateTime(dataObject.analyzedTime);
        const timeEl = document.querySelector('#analyzed-time');
        if (timeEl) {
          timeEl.setAttribute('datetime', formatedTime);
          timeEl.textContent = formatedTime;
        }
      }
    }

    function addVariables() {
      const container = document.querySelector('#container');

      const headingEl = document.createElement('h2');
      headingEl.textContent = 'Defined Variables';
      container.appendChild(headingEl);

      const panelEl = document.createElement('div');
      panelEl.className = 'panel';

      const data = dataObject['definedVariables'];
      if (!data?.length) {
        const p = document.createElement('p');
        p.textContent = 'No data';
        panelEl.appendChild(p);
        container.appendChild(panelEl);
        return;
      };

      const table = document.createElement('table');
      table.className = 'table-data';
      const headers = ['Variable', 'Value', 'Frequency'];
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      data.forEach(entry => {
        const {name, value, count } = entry;
        const tr = document.createElement('tr');
        const nameCell = document.createElement('td');
        const valueCell = document.createElement('td');
        const frequencyCell = document.createElement('td');
        nameCell.textContent = name;
        valueCell.innerHTML = `<code>${value}</code>`;
        frequencyCell.textContent = count;
        tr.appendChild(nameCell);
        tr.appendChild(valueCell);
        tr.appendChild(frequencyCell);
        table.appendChild(tr);
      });

      panelEl.appendChild(table);
      container.appendChild(panelEl);
    };

    function addMixins() {
      const container = document.querySelector('#container');

      const headingEl = document.createElement('h2');
      headingEl.textContent = 'Defined Mixins';
      container.appendChild(headingEl);

      const panelEl = document.createElement('div');
      panelEl.className = 'panel';

      const data = dataObject['definedMixins'];
      if (!data?.length) {
        const p = document.createElement('p');
        p.textContent = 'No data';
        panelEl.appendChild(p);
        container.appendChild(panelEl);
        return;
      };

      const table = document.createElement('table');
      table.className = 'table-data';
      const headers = ['Mixin', 'Frequency'];
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      data.forEach(entry => {
        const {name, count } = entry;
        const tr = document.createElement('tr');
        const nameCell = document.createElement('td');
        const frequencyCell = document.createElement('td');
        nameCell.textContent = `@mixin ${name}`;
        nameCell.style.width = '83.5%';
        frequencyCell.textContent = count;
        tr.appendChild(nameCell);
        tr.appendChild(frequencyCell);
        table.appendChild(tr);
      });

      panelEl.appendChild(table);
      container.appendChild(panelEl);
    };

    function addSection(dataKey, title, filters = null) {
      const container = document.querySelector('#container');

      const headingEl = document.createElement('h2');
      headingEl.textContent = title;
      container.appendChild(headingEl);

      const panelEl = document.createElement('div');
      panelEl.className = 'panel';

      if (filters) {
        const filterEl = document.createElement('div');
        filterEl.className = 'panel-tab-header';
        let filterArray = [];
        if (typeof filters === 'string' && filters === 'auto') {
          filterArray = [...new Set(dataObject[dataKey].map(item => item.property))];
          filterArray.sort();
        } else if (typeof filters === 'object' && filters.length) {
          filterArray = filters;
        }
        filterArray.unshift('all');
        filterArray.forEach((item, index) => {
          const label = document.createElement('label');
          const input = document.createElement('input');
          const span = document.createElement('span');
          input.type = 'radio';
          input.name = `filter-${dataKey}`;
          input.value = item;
          if (index === 0) {
            input.checked = true;
          }
          span.textContent = item;
          label.appendChild(input);
          label.appendChild(span);
          filterEl.appendChild(label);
        });
        panelEl.appendChild(filterEl);
      }

      const data = dataObject[dataKey];
      if (!data?.length) {
        const p = document.createElement('p');
        p.textContent = 'No data';
        panelEl.appendChild(p);
        container.appendChild(panelEl);
        return;
      };

      const table = document.createElement('table');
      table.className = 'table-data';
      const headers = ['Count', 'Value', 'Same as variable?'];
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      const countMap = {};
      data.forEach(item => {
        const key = `${item.property}--${item.value}`;
        countMap[key] = (countMap[key] || 0) + 1;
      });
      const sortedEntries = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
      sortedEntries.forEach(entry => {
        const [key, count] = entry;
        const [property, value] = key.split('--');
        const tr = document.createElement('tr');
        tr.setAttribute('filter', property);
        const countCell = document.createElement('td');
        const valueCell = document.createElement('td');
        const sameCell = document.createElement('td');
        countCell.textContent = count;
        valueCell.innerHTML = `<a class="link-inspect" data-type="${dataKey}" data-prop="${encodeURIComponent(property)}" data-value="${encodeURIComponent(value)}" href="#"><code>${property}: ${value}</code></a>`;
        const sameVariables = dataObject['definedVariables'].filter(item => item.value === value).map(item => item.name);
        sameCell.textContent = sameVariables.length ? sameVariables.join(', ') : '';
        tr.appendChild(countCell);
        tr.appendChild(valueCell);
        tr.appendChild(sameCell);
        table.appendChild(tr);
      });
      panelEl.appendChild(table);
      container.appendChild(panelEl);

    };

    function init() {
      showAnalyzedTime();
      showMediaOptions();
      addVariables();
      addMixins();
      addSection('importantUsages', '!important', 'auto');
      addSection('colorValues', 'Colors', 'auto');
      addSection('fontfamilyValues', 'Font Families');
      addSection('fontsizeValues', 'Font Sizes');
      addSection('fontweightValues', 'Font Weight');
      addSection('lineheightValues', 'Line Height');
      addSection('letterspacingValues', 'Letter Spacing');
      addSection('widthValues', 'Width', 'auto');
      addSection('heightValues', 'Height', 'auto');
      addSection('marginValues', 'Margin', 'auto');
      addSection('paddingValues', 'Padding', 'auto');
      addSection('textshadowValues', 'Text Shadow');
      addSection('boxshadowValues', 'Box Shadow');
      addSection('topValues', 'Top');
      addSection('rightValues', 'Right');
      addSection('bottomValues', 'Bottom');
      addSection('leftValues', 'Left');
      initNavigation();
      initLinkInspect();
      initFilter();
    }

    document.addEventListener('DOMContentLoaded', () => {
      console.log(dataObject);
      init();
    });
  </script>
</body>

</html>
