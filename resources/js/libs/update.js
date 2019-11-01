$(document).ready(() => {
  // generate action URL
  // problem is the url is like http://localhost/admin/users/00000
  // and when e.g. updating must be like that http://localhost/admin/users/updae/00000
  // the method parameter will be insert after users and befor id
  function genetareAction(method) {
    const url = new URL(window.location.href);
    const { origin } = url;
    const { pathname } = url;
    const id = pathname.split('/').pop();
    const newUrl = `${origin}${pathname.slice(0, pathname.length - id.length)}${method}/${id}`;
    return newUrl;
  }

  // check if the string can be parsed to JSON
  // function convertedToJson(data) {
  //   try {
  //     return JSON.parse(data);
  //   } catch (error) {
  //     return window.location.reload();
  //   }
  // }

  // add green background to td after insert successfully
  // then remove it after 3 second
  // function addSuccessBg(td) {
  //   td.addClass('success-bg');
  //   setTimeout(() => {
  //     td.removeClass('success-bg');
  //   }, 3000);
  // }

  // append alert if not exists
  // if it is existing just change the message
  // function appendAlert(td, msg) {
  //   if (!$('.alert-danger')[0]) {
  //     td.prepend(`<div class="alert alert-danger" role="alert">${msg}</div>`);
  //   } else {
  //     $('.alert-danger')[0].innerHTML = msg;
  //   }
  // }

  function createElm(elm) {
    // get the value from td
    const value = $(elm).text();

    // attributes values
    const tag = $(elm).attr('data-tag') || 'input';
    const type = $(elm).attr('data-type') || 'text';
    const name = $(elm).attr('data-name');

    if (tag === 'input') {
      if (type === 'date') {
        return `<input type="text" value="${value}" data-text="${value}" name="${name}" class="form-control input-edit date"/>`;
      }
      return `<input type="${type}" value="${value}" data-text="${value}" name="${name}" class="form-control input-edit"/>`;
    }
    if (tag === 'textarea') {
      return `<textarea value="${value}" data-text="${value}" name="${name}" class="form-control input-edit">${value}</textarea>`;
    }
    if (tag === 'select') {
      const options = $(elm).attr('data-options');
      if (options) {
        let option = '';
        // loop over the options that contain in the data-options attribute
        options.split(',').forEach((op) => {
          // check the right value
          const selected = (op === value) ? 'selected' : '';
          option += `<option ${selected} value="${op}">${op}</option>`;
        });
        // insert the select tag in it
        return `
        <select class="form-control input-edit" data-text="${value}" name="${name}">
          ${option}
        </select>
        `;
      }
      return '<select class="form-control input-edit" data-text="" name=""></select>';
    }
    return false;
  }

  // remove the background fronm td when clicking on the document
  $(document).on('click', () => {
    $('.editable').removeClass('success-bg');
  });

  $('.editable').click(function (event) {
    // check if the td is open before
    // check that the user doesn't click on the buttons
    if ($(this).find('.form-editable')[0] || $(event.target).is('btn-cl, btn-cl *, btn-sub, btn-sub *')) return;

    // close all the elms that was opened
    $('.editable').each(function () {
      // get the value that storage in the data-text of the elm
      const text = $(this).find('.input-edit').attr('data-text');
      $(this).html(text);
    });

    const url = genetareAction('update');
    const htmlCodeInput = createElm(this);

    // create html form and insert the elm in it
    $(this).html(`
      <form class='form-editable' method='POST' action='${url}' autocomplete='off'>
        <div>
        ${htmlCodeInput}
        </div>
        <div>
          <button class="btn btn-brand btn-sm btn-primary btn-sub" type="submit"><i class="fas fa-check"></i></button>
          <button class="btn btn-brand btn-sm btn-danger btn-cl" type="button"><i class="fas fa-times"></i></button>
        </div>
      </form>
    `);

    // date picker
    $('.editable input.date').datepicker({
      format: 'dd M yyyy',
      startDate: '01/01/1920',
      endDate: '31/12/2004',
    });

    // focus on the elm
    $('.input-edit').focus();

    // close elm
    $('.btn-cl').click(function () {
      const form = $(this).parents('.form-editable')[0];
      // check if the td is open
      // if has form then the elm is open
      if (form) {
        const input = $(form).find('.input-edit')[0];
        if (input) {
          // get the storge value
          const text = $(input).attr('data-text');
          const td = $(form).parents('.editable')[0];
          $(td).html(text);
        }
      }
    });

    // close the elm when click outside the td
    $(document).on('click', (e) => {
      // check if the click outside the .editable
      if (!$(e.target).is('.editable, .editable *')) {
        // get the text from attribute data-text and put it again in .editable
        $('.editable').each(function () {
          const text = $(this).find('.input-edit').attr('data-text');
          $(this).html(text);
        });
      }
    });

    // ajax request for inputs
    // $('.form-editable').submit(function (e) {
    //   e.preventDefault();

    //   const form = $(this);
    //   const action = form.attr('action');
    //   const td = $(this).parents('.editable');

    //   $.ajax({
    //     type: 'POST',
    //     url: action,
    //     data: form.serialize(),
    //     beforeSend: () => {
    //       td.append('<div class="disable-box"><i class="fas fa-spinner loading"></i></div>');
    //     },
    //     success: (data) => {
    //       const json = convertedToJson(data);
    //       if (json.success) {
    //         // "not text" means that it's let the input empty so it will be jsut empty
    //         if (json.success === 'no text') {
    //           td.html('');
    //         } else {
    //           td.html(json.success.trim());
    //         }
    //         addSuccessBg(td);
    //       } else if (json.error) {
    //         const input = Object.keys(json.error)[0];
    //         appendAlert(td, json.error[input]);
    //       } else {
    //         window.location.reload();
    //       }
    //       td.find('.disable-box').remove();
    //     },
    //     fail: () => {
    //       window.location.reload();
    //     },
    //   });
    // });
  });
});