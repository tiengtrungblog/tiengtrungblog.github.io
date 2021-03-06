var soloKanbanniang = {
    clearTime: '',
    showMessage: function (text, timeout) {
      if (sessionStorage.getItem('soloKanbanniang') === 'close') {
        return
      }
      if (Array.isArray(text)) {
        text = text[Math.floor(Math.random() * text.length + 1) - 1]
      }
      $('.solo-kanbanniang__tip').html(text).fadeTo(200, 1)
      clearTimeout(this.clearTime)
      this.clearTime = setTimeout(function () {
        $('.solo-kanbanniang__tip').fadeTo(200, 0)
      }, timeout)
    },
    _initMove: function () {
      if (sessionStorage.soloKanbanniangX) {
        $('.solo-kanbanniang').css('left', sessionStorage.soloKanbanniangX + 'px')
      }
      if (sessionStorage.soloKanbanniangY) {
        $('.solo-kanbanniang').css('top', sessionStorage.soloKanbanniangY + 'px')
      }
      $('.solo-kanbanniang').mousedown(function (event) {
        var _document = document
        if (!event) {
          event = window.event
        }
        var dialog = this
        var x = event.clientX - parseInt(dialog.style.left || 0),
          y = event.clientY -
            parseInt(dialog.style.top || $(window).height() - $(dialog).height())
        _document.ondragstart = 'return false;'
        _document.onselectstart = 'return false;'
        _document.onselect = 'document.selection.empty();'
  
        if (this.setCapture) {
          this.setCapture()
        } else if (window.captureEvents) {
          window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
        }
  
        _document.onmousemove = function (event) {
          if (!event) {
            event = window.event
          }
          var positionX = event.clientX - x,
            positionY = event.clientY - y
          if (positionX < 0) {
            positionX = 0
          }
          if (positionX > $(window).width() - $(dialog).width()) {
            positionX = $(window).width() - $(dialog).width()
          }
          if (positionY < 0) {
            positionY = 0
          }
          if (positionY > $(window).height() - $(dialog).height()) {
            positionY = $(window).height() - $(dialog).height()
          }
          dialog.style.left = positionX + 'px'
          dialog.style.top = positionY + 'px'
          sessionStorage.setItem('soloKanbanniangX', positionX)
          sessionStorage.setItem('soloKanbanniangY', positionY)
        }
  
        _document.onmouseup = function () {
          if (this.releaseCapture) {
            this.releaseCapture()
          } else if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
          }
          _document.onmousemove = null
          _document.onmouseup = null
          _document.ondragstart = null
          _document.onselectstart = null
          _document.onselect = null
        }
      })
    },
    _initTips: function () {
      $.ajax({
        cache: true,
        url: 'https://tiengtrungblog.github.io/tips.json',
        dataType: 'json',
        success: function (result) {
          $.each(result.mouseover, function (index, tips) {
            $(document).on('mouseover', tips.selector, function () {
              soloKanbanniang.showMessage(
                tips.text.replace('{text}', $.trim($(this).text()).substr(0, 42)),
                3000)
            })
          })
          $.each(result.click, function (index, tips) {
            $(document).on('click', tips.selector, function () {
              var text = tips.text[Math.floor(Math.random() * tips.text.length +
                1) - 1]
              soloKanbanniang.showMessage(text, 3000, true)
            })
          })
          $.each(result.seasons, function (index, tips) {
            var now = new Date()
            var after = tips.date.split('-')[0]
            var before = tips.date.split('-')[1] || after
  
            if ((after.split('/')[0] <= now.getMonth() + 1 &&
              now.getMonth() + 1 <= before.split('/')[0]) &&
              (after.split('/')[1] <= now.getDate() &&
                now.getDate() <= before.split('/')[1])) {
              soloKanbanniang.showMessage(
                tips.text.replace('{year}', now.getFullYear()), 6000, true)
            }
          })
        },
      })
    },
    _initMenu: function () {
      $('#soloKanbanniangHome').click(function () {
        window.location = "https://tiengtrungblog.github.io"
      })
  
      $('#soloKanbanniangYoutube').click(function () {
        window.location = 'https://www.youtube.com/channel/UCUBeAbkAG2BVo2rh5zK2dKg'
      })
  
      $('#soloKanbanniangGithub').click(function () {
        window.location = 'https://github.com/b3log/solo'
      })
  
      $('#soloKanbanniangChat').click(function () {
        soloKanbanniang.showChat()
        soloKanbanniang.bgChange()
      })
  
      $('#soloKanbanniangChange').click(function () {
        loadlive2d('soloKanbanniang',
          'https://ld246.com/kanbanniang/model?t=' + (new Date()).getTime(),
          soloKanbanniang.showMessage('????? m???i c???a m??nh ?????y! ?????p kh??ng?', 3000, true))
        soloKanbanniang.bgChange()
      })
  
      $('#soloKanbanniangClose').click(function () {
        soloKanbanniang.showMessage('G???p l???i c??u sau nh??!', 1300, true)
        sessionStorage.setItem('soloKanbanniang', 'close')
        window.setTimeout(function () {
          $('.solo-kanbanniang').hide()
        }, 1300)
      })
  
      $('#soloKanbanniangPhoto').click(function () {
        soloKanbanniang.showMessage('Ch???p xong r???i ???? h??? :3 ?', 5000, true)
        window.Live2D.captureName = 'solo.png'
        window.Live2D.captureFrame = true
      })
    },
    _initFirstMsg: function () {
      var text
      var referrer = document.createElement('a')
      if (document.referrer !== '') {
        referrer.href = document.referrer
      }
  
      if (referrer.href !== '' && referrer.hostname !==
        Label.servePath.split('//')[1].split(':')[0]) {
        var referrer = document.createElement('a')
        referrer.href = document.referrer
        text = 'Hello! Ch??o m???t c???u, c???u ?????n t??? <span style="color:#4285f4;">' + referrer.hostname +
          '</span> ph???i kh??ng?'
        var domain = referrer.hostname.split('.')[1]
        if (domain == 'baidu') {
          text = 'Hello! ?????? ???????????? ?????????<br>???????????? <span style="color:#4285f4;">' +
            referrer.search.split('&wd=')[1].split('&')[0] + '</span> ??????????????????'
        } else if (domain == 'so') {
          text = 'Hello! ?????? 360?????? ?????????<br>???????????? <span style="color:#4285f4;">' +
            referrer.search.split('&q=')[1].split('&')[0] + '</span> ??????????????????'
        } else if (domain == 'google') {
          text = 'Hello! ?????? ???????????? ?????????<br>????????????<span style="color:#4285f4;">???' +
            document.title.split(' - ')[0] + '???</span>'
        }
      } else {
        var now = (new Date()).getHours()
        if (now > 23 || now <= 5) {
          text = 'Th???c khuya th??? l??m g?? :( ??i ng??? s???m ??i k???o m??nh lo!'
        } else if (now > 5 && now <= 7) {
          text = 'Tr???i s??ng r???i, ch??c b???n c?? m???t ng??y vui v??? nh?? :P'
        } else if (now > 7 && now <= 11) {
          text = '???? ?????n gi??? ?????n tr?????ng v???i ??i l??m r???i ?????y, c??ng nhau c??? g???ng nh??????????????'
        } else if (now > 11 && now <= 14) {
          text = 'Ngh??? tr??a th??i n??o, bu???i s??ng c???a b???n c?? t???t kh??ng? H??y ti???p t???c c??? g???ng nh?? :P???'
        } else if (now > 14 && now <= 17) {
          text = 'Bu???i chi???u khi???n cho con ng?????i ta bu???n ng??? qu?? ??i th??i :( nh??ng v???n ph???i ti???p t???c nh???!'
        } else if (now > 17 && now <= 19) {
          text = 'Kho???ng th???i gian ?????p nh???t c???a m???t ng??y l?? khi n??o? L?? nh???ng l??c chi???u mu???n nh?? n??y ?????y! Th?? gi???n ??i n??o...'
        } else if (now > 19 && now <= 21) {
          text = 'Ng??y h??m nay c???a b???n sao r???i???V???n t???t c??? nh???, cu???c s???ng l?? m???t cu???c h??nh tr??nh, h??m nay b???n ???? ??i ???????c th??m r???i ?????y! C??ng ti???p t???c ??i n??o!'
        } else if (now > 21 && now <= 23) {
          text = 'Mu???n l???m r???i ?????y! ??i ng??? th??i! :> Ch??c b???n ng??? ngon! ?????????'
        } else {
          text = '???~ ?????????????????????'
        }
      }
      soloKanbanniang.showMessage(text, 6000)
    },
    init: function () {
      this._initTips()
      this._initMenu()
      this._initFirstMsg()
      this._initMove()
  
      soloKanbanniang.bgChange()
  
      window.setInterval(soloKanbanniang.showChat, 30000)
  
      $(document).on('copy', function () {
        soloKanbanniang.showMessage('V???a copy c??i g?? xong ????ng kh??ng -_-', 5000, true)
      })
    },
    showChat: function () {
      if (sessionStorage.getItem('soloKanbanniang') !== 'close') {
        $.getJSON(
          'https://api.imjad.cn/hitokoto/?cat=&charset=utf-8&length=55&encode=json',
          function (result) {
            soloKanbanniang.showMessage(result.hitokoto, 5000)
          })
      }
    },
    bgChange: function () {
      $('.solo-kanbanniang').
        css('background-image',
          'url(https://cdn.jsdelivr.net/npm/kanbanniang-tia/background/sakura' +
          Math.floor(Math.random() * 11) + '.gif)')
    },
  }
  
  if (navigator.userAgent.indexOf('MSIE') === -1 && $(window).width() > 720) {
    $(document).ready(function () {
      if (sessionStorage.getItem('soloKanbanniang') === 'close') {
        $('.solo-kanbanniang').remove()
        return
      }
  
      $.ajax({
        url: 'https://cdn.jsdelivr.net/npm/kanbanniang@0.2.6/live2d.js',
        dataType: 'script',
        cache: true,
        success: function () {
          soloKanbanniang.init()
  
          loadlive2d('soloKanbanniang',
            'https://ld246.com/kanbanniang/model?t=' + (new Date()).getTime())
        },
      })
    })
  } else {
    $(document).ready(function () {
      $('.solo-kanbanniang').remove()
    })
  }
