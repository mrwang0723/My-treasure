/**
 * Created by Administrator on 2017/4/19 0019.
 */
!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module)module.exports = e(); else if ("function" == typeof define && define.amd)define([], e); else {
        var n;
        n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, n.pingpp = e()
    }
}(function () {
    return function e(n, t, a) {
        function r(l, o) {
            if (!t[l]) {
                if (!n[l]) {
                    var c = "function" == typeof require && require;
                    if (!o && c)return c(l, !0);
                    if (i)return i(l, !0);
                    var s = new Error("Cannot find module '" + l + "'");
                    throw s.code = "MODULE_NOT_FOUND", s
                }
                var d = t[l] = {exports: {}};
                n[l][0].call(d.exports, function (e) {
                    var t = n[l][1][e];
                    return r(t ? t : e)
                }, d, d.exports, e, n, t, a)
            }
            return t[l].exports
        }

        for (var i = "function" == typeof require && require, l = 0; l < a.length; l++)r(a[l]);
        return r
    }({
        1: [function (e, n, t) {
            var a = e('./payment_elements.js');
            n.exports = {
                userCallback: void 0, innerCallback: function (e, n) {
                    'function' == typeof this.userCallback && ('undefined' == typeof n && (n = this.error()), this.userCallback(e, n), this.userCallback = void 0, a.clear())
                }, error: function (e, n) {
                    return e = 'undefined' == typeof e ? '' : e, n = 'undefined' == typeof n ? '' : n, {
                        msg: e,
                        extra: n
                    }
                }
            }
        }, {"./payment_elements.js": 22}], 2: [function (e, n, t) {
            var a = e('../utils'), r = {}.hasOwnProperty;
            n.exports = {
                ALIPAY_PC_DIRECT_URL: 'https://mapi.alipay.com/gateway.do', handleCharge: function (e) {
                    var n = e.channel, t = e.credential[n], i = this.ALIPAY_PC_DIRECT_URL;
                    r.call(t, 'channel_url') && (i = t.channel_url), r.call(t, '_input_charset') || (t._input_charset = 'utf-8');
                    var l = a.stringifyData(t, n, !0);
                    a.redirectTo(i + '?' + l)
                }
            }
        }, {"../utils": 25}], 3: [function (e, n, t) {
            var a = e('../utils'), r = e('../mods'), i = {}.hasOwnProperty;
            n.exports = {
                ALIPAY_WAP_URL_OLD: 'https://wappaygw.alipay.com/service/rest.htm',
                ALIPAY_WAP_URL: 'https://mapi.alipay.com/gateway.do',
                handleCharge: function (e) {
                    var n = e.channel, t = e.credential[n], l = this.ALIPAY_WAP_URL;
                    i.call(t, 'req_data') ? l = this.ALIPAY_WAP_URL_OLD : i.call(t, 'channel_url') && (l = t.channel_url), i.call(t, '_input_charset') || (i.call(t, 'service') && 'alipay.wap.create.direct.pay.by.user' === t.service || i.call(t, 'req_data')) && (t._input_charset = 'utf-8');
                    var o = a.stringifyData(t, n, !0), c = l + '?' + o, s = r.getExtraModule('ap');
                    a.inWeixin() && 'undefined' != typeof s ? s.pay(c) : a.redirectTo(c)
                }
            }
        }, {"../mods": 21, "../utils": 25}], 4: [function (e, n, t) {
            var a = e('../utils'), r = e('../callbacks'), i = {}.hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    var n = e.channel, t = e.credential[n];
                    return i.call(t, 'url') ? void a.redirectTo(t.url + '?' + a.stringifyData(t, n)) : void r.innerCallback('fail', r.error('invalid_credential', 'missing_field:url'))
                }
            }
        }, {"../callbacks": 1, "../utils": 25}], 5: [function (e, n, t) {
            var a = e('../../utils'), r = e('../../callbacks'), i = {}.hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    var n, t = e.credential[e.channel];
                    if ('string' == typeof t)n = t; else {
                        if (!i.call(t, 'url'))return void r.innerCallback('fail', r.error('invalid_credential', 'credential format is incorrect'));
                        n = t.url
                    }
                    a.redirectTo(n)
                }
            }
        }, {"../../callbacks": 1, "../../utils": 25}], 6: [function (e, n, t) {
            var a = e('../utils');
            n.exports = {
                CP_B2B_URL: 'https://payment.chinapay.com/CTITS/service/rest/page/nref/000000000017/0/0/0/0/0',
                handleCharge: function (e) {
                    var n = e.credential[e.channel];
                    a.formSubmit(this.CP_B2B_URL, 'post', n)
                }
            }
        }, {"../utils": 25}], 7: [function (e, n, t) {
            var a = e('./commons/redirect_base');
            n.exports = {
                handleCharge: function (e) {
                    a.handleCharge(e)
                }
            }
        }, {"./commons/redirect_base": 5}], 8: [function (e, n, t) {
            arguments[4][7][0].apply(t, arguments)
        }, {"./commons/redirect_base": 5, dup: 7}], 9: [function (e, n, t) {
            var a = e('../utils'), r = {}.hasOwnProperty;
            n.exports = {
                JDPAY_WAP_URL_OLD: 'https://m.jdpay.com/wepay/web/pay',
                JDPAY_H5_URL: 'https://h5pay.jd.com/jdpay/saveOrder',
                JDPAY_PC_URL: 'https://wepay.jd.com/jdpay/saveOrder',
                handleCharge: function (e) {
                    var n = e.credential[e.channel], t = this.JDPAY_H5_URL;
                    r.call(n, 'channelUrl') ? (t = n.channelUrl, delete n.channelUrl) : r.call(n, 'merchantRemark') && (t = this.JDPAY_WAP_URL_OLD), a.formSubmit(t, 'post', n)
                }
            }
        }, {"../utils": 25}], 10: [function (e, n, t) {
            var a = e('../callbacks'), r = e('../utils'), i = e('../stash'), l = {}.hasOwnProperty;
            n.exports = {
                SRC_URL: 'http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152',
                ID: 'mqq_api',
                handleCharge: function (e) {
                    var n = e.credential[e.channel];
                    return l.call(n, 'token_id') ? (i.tokenId = n.token_id, void r.loadUrlJs(this.ID, this.SRC_URL, this.callpay)) : void a.innerCallback('fail', a.error('invalid_credential', 'missing_token_id'))
                },
                callpay: function () {
                    if ('undefined' != typeof mqq) {
                        if (0 == mqq.QQVersion)return a.innerCallback('fail', 'Not in the QQ client'), void delete i.tokenId;
                        mqq.tenpay.pay({tokenId: i.tokenId}, a.userCallback)
                    } else a.innerCallback('fail', 'network_err');
                    delete i.tokenId
                }
            }
        }, {"../callbacks": 1, "../stash": 23, "../utils": 25}], 11: [function (e, n, t) {
            var a = e('../utils');
            n.exports = {
                UPACP_PC_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',
                handleCharge: function (e) {
                    var n = e.credential[e.channel];
                    a.formSubmit(this.UPACP_PC_URL, 'post', n)
                }
            }
        }, {"../utils": 25}], 12: [function (e, n, t) {
            var a = e('../utils');
            n.exports = {
                UPACP_WAP_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',
                handleCharge: function (e) {
                    var n = e.credential[e.channel];
                    a.formSubmit(this.UPACP_WAP_URL, 'post', n)
                }
            }
        }, {"../utils": 25}], 13: [function (e, n, t) {
            var a = e('../stash'), r = e('../callbacks'), i = {}.hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    for (var n = e.credential[e.channel], t = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'], l = 0; l < t.length; l++)if (!i.call(n, t[l]))return void r.innerCallback('fail', r.error('invalid_credential', 'missing_field_' + t[l]));
                    a.jsApiParameters = n, this.callpay()
                }, wxLiteEnabled: function () {
                    return 'undefined' != typeof wx && wx.requestPayment
                }, callpay: function () {
                    if (!this.wxLiteEnabled())return void console.log('请在微信小程序中打开');
                    var e = a.jsApiParameters;
                    delete e.appId, e.complete = function (e) {
                        'requestPayment:ok' === e.errMsg && r.innerCallback('success'), 'requestPayment:cancel' === e.errMsg && r.innerCallback('cancel', r.error('用户取消支付')), 'undefined' !== e.err_code && 'undefined' !== e.err_desc && r.innerCallback('fail', r.error(e.err_desc, e))
                    }, wx.requestPayment(e)
                }, runTestMode: function (e) {
                    wx.showModal({title: '提示', content: '因 "微信小程序" 限制 域名的原因 暂不支持 模拟付款 请使用 livekey 获取 charge 进行支付'})
                }
            }
        }, {"../callbacks": 1, "../stash": 23}], 14: [function (e, n, t) {
            var a = e('../callbacks'), r = e('../utils'), i = e('../stash'), l = e('../mods'), o = {}.hasOwnProperty;
            n.exports = {
                PINGPP_NOTIFY_URL_BASE: 'https://api.pingxx.com/notify', handleCharge: function (e) {
                    for (var n = e.credential[e.channel], t = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'], r = 0; r < t.length; r++)if (!o.call(n, t[r]))return void a.innerCallback('fail', a.error('invalid_credential', 'missing_field_' + t[r]));
                    i.jsApiParameters = n, this.callpay()
                }, callpay: function () {
                    var e = this, n = l.getExtraModule('wx_jssdk');
                    if ('undefined' != typeof n && n.jssdkEnabled())n.callpay(); else if ('undefined' == typeof WeixinJSBridge) {
                        var t = function () {
                            e.jsApiCall()
                        };
                        document.addEventListener ? document.addEventListener('WeixinJSBridgeReady', t, !1) : document.attachEvent && (document.attachEvent('WeixinJSBridgeReady', t), document.attachEvent('onWeixinJSBridgeReady', t))
                    } else this.jsApiCall()
                }, jsApiCall: function () {
                    o.call(i, 'jsApiParameters') && WeixinJSBridge.invoke('getBrandWCPayRequest', i.jsApiParameters, function (e) {
                        delete i.jsApiParameters, 'get_brand_wcpay_request:ok' == e.err_msg ? a.innerCallback('success') : 'get_brand_wcpay_request:cancel' == e.err_msg ? a.innerCallback('cancel') : a.innerCallback('fail', a.error('wx_result_fail', e.err_msg))
                    })
                }, runTestMode: function (e) {
                    var n = confirm('模拟付款？');
                    if (n) {
                        var t = (null === e.or_id ? '' : '/orders/' + e.or_id) + '/charges/' + e.id;
                        r.request(this.PINGPP_NOTIFY_URL_BASE + t + '?livemode=false', 'GET', null, function (e, n) {
                            if (n >= 200 && n < 400 && 'success' == e)a.innerCallback('success'); else {
                                var t = 'http_code:' + n + ';response:' + e;
                                a.innerCallback('fail', a.error('testmode_notify_fail', t))
                            }
                        }, function () {
                            a.innerCallback('fail', a.error('network_err'))
                        })
                    }
                }
            }
        }, {"../callbacks": 1, "../mods": 21, "../stash": 23, "../utils": 25}], 15: [function (e, n, t) {
            var a = e('../utils'), r = e('../callbacks'), i = {}.hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    var n = e.credential[e.channel];
                    'string' == typeof n ? a.redirectTo(n) : 'object' == typeof n && i.call(n, 'url') ? a.redirectTo(n.url) : r.innerCallback('fail', r.error('invalid_credential', 'credential 格式不正确'))
                }
            }
        }, {"../callbacks": 1, "../utils": 25}], 16: [function (e, n, t) {
            var a = e('../utils'), r = e('../callbacks'), i = {}.hasOwnProperty;
            n.exports = {
                YEEPAY_WAP_URL: 'https://ok.yeepay.com/paymobile/api/pay/request',
                YEEPAY_WAP_TEST_URL: 'http://mobiletest.yeepay.com/paymobile/api/pay/request',
                handleCharge: function (e) {
                    for (var n = e.channel, t = e.credential[n], l = ['merchantaccount', 'encryptkey', 'data'], o = 0; o < l.length; o++)if (!i.call(t, l[o]))return void r.innerCallback('fail', r.error('invalid_credential', 'missing_field_' + l[o]));
                    var c;
                    c = i.call(t, 'mode') && 'test' == t.mode ? this.YEEPAY_WAP_TEST_URL : this.YEEPAY_WAP_URL, a.redirectTo(c + '?' + a.stringifyData(t, n, !0))
                }
            }
        }, {"../callbacks": 1, "../utils": 25}], 17: [function (e, n, t) {
            var a = e('./utils'), r = e('./stash'), i = e('./libs/md5'), l = {
                seperator: '###',
                limit: 1,
                report_url: 'https://statistics.pingxx.com/one_stats',
                timeout: 100
            }, o = function (e, n) {
                var t = new RegExp('(^|&)' + n + '=([^&]*)(&|$)', 'i'), a = e.substr(0).match(t);
                return null !== a ? unescape(a[2]) : null
            }, c = function () {
                return navigator.userAgent
            }, s = function () {
                return window.location.host
            };
            l.store = function (e) {
                if ('undefined' != typeof localStorage && null !== localStorage) {
                    var n = this, t = {};
                    t.app_id = e.app_id || r.app_id || 'app_not_defined', t.ch_id = e.ch_id || '', t.channel = e.channel || '', t.type = e.type || '', t.user_agent = c(), t.host = s(), t.time = (new Date).getTime(), t.puid = r.puid;
                    var a = 'app_id=' + t.app_id + '&channel=' + t.channel + '&ch_id=' + t.ch_id + '&host=' + t.host + '&time=' + t.time + '&type=' + t.type + '&user_agent=' + t.user_agent + '&puid=' + t.puid, i = a;
                    null !== localStorage.getItem('PPP_ONE_STATS') && 0 !== localStorage.getItem('PPP_ONE_STATS').length && (i = localStorage.getItem('PPP_ONE_STATS') + n.seperator + a);
                    try {
                        localStorage.setItem('PPP_ONE_STATS', i)
                    } catch (l) {
                    }
                }
            }, l.send = function () {
                if ('undefined' != typeof localStorage && null !== localStorage) {
                    var e = this, n = localStorage.getItem('PPP_ONE_STATS');
                    if (!(null === n || n.split(e.seperator).length < e.limit))try {
                        for (var t = [], r = n.split(e.seperator), l = i(r.join('&')), c = 0; c < r.length; c++)t.push({
                            app_id: o(r[c], 'app_id'),
                            channel: o(r[c], 'channel'),
                            ch_id: o(r[c], 'ch_id'),
                            host: o(r[c], 'host'),
                            time: o(r[c], 'time'),
                            type: o(r[c], 'type'),
                            user_agent: o(r[c], 'user_agent'),
                            puid: o(r[c], 'puid')
                        });
                        a.request(e.report_url, 'POST', t, function (e, n) {
                            200 == n && localStorage.removeItem('PPP_ONE_STATS')
                        }, void 0, {'X-Pingpp-Report-Token': l})
                    } catch (s) {
                    }
                }
            }, l.report = function (e) {
                var n = this;
                n.store(e), setTimeout(function () {
                    n.send()
                }, n.timeout)
            }, n.exports = l
        }, {"./libs/md5": 19, "./stash": 23, "./utils": 25}], 18: [function (e, n, t) {
            var a = e('./stash'), r = e('./utils'), i = e('./collection');
            n.exports = {
                SRC_URL: 'https://cookie.pingxx.com', init: function () {
                    var e = this;
                    r.documentReady(function () {
                        e.initPuid()
                    })
                }, initPuid: function () {
                    if ('undefined' != typeof window && 'undefined' != typeof localStorage) {
                        var e = localStorage.getItem('pingpp_uid');
                        if (null === e) {
                            e = r.randomString();
                            try {
                                localStorage.setItem('pingpp_uid', e)
                            } catch (n) {
                            }
                        }
                        if (a.puid = e, !document.getElementById('p_analyse_iframe')) {
                            var t;
                            try {
                                t = document.createElement('iframe')
                            } catch (n) {
                                t = document.createElement('<iframe name="ifr"></iframe>')
                            }
                            t.id = 'p_analyse_iframe', t.src = this.SRC_URL + '/?puid=' + e, t.style.display = 'none', document.body.appendChild(t)
                        }
                        setTimeout(function () {
                            i.send()
                        }, 0)
                    }
                }
            }
        }, {"./collection": 17, "./stash": 23, "./utils": 25}], 19: [function (e, n, t) {
            !function () {
                function e(e, n) {
                    var t = (65535 & e) + (65535 & n), a = (e >> 16) + (n >> 16) + (t >> 16);
                    return a << 16 | 65535 & t
                }

                function t(e, n) {
                    return e << n | e >>> 32 - n
                }

                function a(n, a, r, i, l, o) {
                    return e(t(e(e(a, n), e(i, o)), l), r)
                }

                function r(e, n, t, r, i, l, o) {
                    return a(n & t | ~n & r, e, n, i, l, o)
                }

                function i(e, n, t, r, i, l, o) {
                    return a(n & r | t & ~r, e, n, i, l, o)
                }

                function l(e, n, t, r, i, l, o) {
                    return a(n ^ t ^ r, e, n, i, l, o)
                }

                function o(e, n, t, r, i, l, o) {
                    return a(t ^ (n | ~r), e, n, i, l, o)
                }

                function c(n, t) {
                    n[t >> 5] |= 128 << t % 32, n[(t + 64 >>> 9 << 4) + 14] = t;
                    var a, c, s, d, u, p = 1732584193, f = -271733879, h = -1732584194, _ = 271733878;
                    for (a = 0; a < n.length; a += 16)c = p, s = f, d = h, u = _, p = r(p, f, h, _, n[a], 7, -680876936), _ = r(_, p, f, h, n[a + 1], 12, -389564586), h = r(h, _, p, f, n[a + 2], 17, 606105819), f = r(f, h, _, p, n[a + 3], 22, -1044525330), p = r(p, f, h, _, n[a + 4], 7, -176418897), _ = r(_, p, f, h, n[a + 5], 12, 1200080426), h = r(h, _, p, f, n[a + 6], 17, -1473231341), f = r(f, h, _, p, n[a + 7], 22, -45705983), p = r(p, f, h, _, n[a + 8], 7, 1770035416), _ = r(_, p, f, h, n[a + 9], 12, -1958414417), h = r(h, _, p, f, n[a + 10], 17, -42063), f = r(f, h, _, p, n[a + 11], 22, -1990404162), p = r(p, f, h, _, n[a + 12], 7, 1804603682), _ = r(_, p, f, h, n[a + 13], 12, -40341101), h = r(h, _, p, f, n[a + 14], 17, -1502002290), f = r(f, h, _, p, n[a + 15], 22, 1236535329), p = i(p, f, h, _, n[a + 1], 5, -165796510), _ = i(_, p, f, h, n[a + 6], 9, -1069501632), h = i(h, _, p, f, n[a + 11], 14, 643717713), f = i(f, h, _, p, n[a], 20, -373897302), p = i(p, f, h, _, n[a + 5], 5, -701558691), _ = i(_, p, f, h, n[a + 10], 9, 38016083), h = i(h, _, p, f, n[a + 15], 14, -660478335), f = i(f, h, _, p, n[a + 4], 20, -405537848), p = i(p, f, h, _, n[a + 9], 5, 568446438), _ = i(_, p, f, h, n[a + 14], 9, -1019803690), h = i(h, _, p, f, n[a + 3], 14, -187363961), f = i(f, h, _, p, n[a + 8], 20, 1163531501), p = i(p, f, h, _, n[a + 13], 5, -1444681467), _ = i(_, p, f, h, n[a + 2], 9, -51403784), h = i(h, _, p, f, n[a + 7], 14, 1735328473), f = i(f, h, _, p, n[a + 12], 20, -1926607734), p = l(p, f, h, _, n[a + 5], 4, -378558), _ = l(_, p, f, h, n[a + 8], 11, -2022574463), h = l(h, _, p, f, n[a + 11], 16, 1839030562), f = l(f, h, _, p, n[a + 14], 23, -35309556), p = l(p, f, h, _, n[a + 1], 4, -1530992060), _ = l(_, p, f, h, n[a + 4], 11, 1272893353), h = l(h, _, p, f, n[a + 7], 16, -155497632), f = l(f, h, _, p, n[a + 10], 23, -1094730640), p = l(p, f, h, _, n[a + 13], 4, 681279174), _ = l(_, p, f, h, n[a], 11, -358537222), h = l(h, _, p, f, n[a + 3], 16, -722521979), f = l(f, h, _, p, n[a + 6], 23, 76029189), p = l(p, f, h, _, n[a + 9], 4, -640364487), _ = l(_, p, f, h, n[a + 12], 11, -421815835), h = l(h, _, p, f, n[a + 15], 16, 530742520), f = l(f, h, _, p, n[a + 2], 23, -995338651), p = o(p, f, h, _, n[a], 6, -198630844), _ = o(_, p, f, h, n[a + 7], 10, 1126891415), h = o(h, _, p, f, n[a + 14], 15, -1416354905), f = o(f, h, _, p, n[a + 5], 21, -57434055), p = o(p, f, h, _, n[a + 12], 6, 1700485571), _ = o(_, p, f, h, n[a + 3], 10, -1894986606), h = o(h, _, p, f, n[a + 10], 15, -1051523), f = o(f, h, _, p, n[a + 1], 21, -2054922799), p = o(p, f, h, _, n[a + 8], 6, 1873313359), _ = o(_, p, f, h, n[a + 15], 10, -30611744), h = o(h, _, p, f, n[a + 6], 15, -1560198380), f = o(f, h, _, p, n[a + 13], 21, 1309151649), p = o(p, f, h, _, n[a + 4], 6, -145523070), _ = o(_, p, f, h, n[a + 11], 10, -1120210379), h = o(h, _, p, f, n[a + 2], 15, 718787259), f = o(f, h, _, p, n[a + 9], 21, -343485551), p = e(p, c), f = e(f, s), h = e(h, d), _ = e(_, u);
                    return [p, f, h, _]
                }

                function s(e) {
                    var n, t = '';
                    for (n = 0; n < 32 * e.length; n += 8)t += String.fromCharCode(e[n >> 5] >>> n % 32 & 255);
                    return t
                }

                function d(e) {
                    var n, t = [];
                    for (t[(e.length >> 2) - 1] = void 0, n = 0; n < t.length; n += 1)t[n] = 0;
                    for (n = 0; n < 8 * e.length; n += 8)t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << n % 32;
                    return t
                }

                function u(e) {
                    return s(c(d(e), 8 * e.length))
                }

                function p(e, n) {
                    var t, a, r = d(e), i = [], l = [];
                    for (i[15] = l[15] = void 0, r.length > 16 && (r = c(r, 8 * e.length)), t = 0; t < 16; t += 1)i[t] = 909522486 ^ r[t], l[t] = 1549556828 ^ r[t];
                    return a = c(i.concat(d(n)), 512 + 8 * n.length), s(c(l.concat(a), 640))
                }

                function f(e) {
                    var n, t, a = '0123456789abcdef', r = '';
                    for (t = 0; t < e.length; t += 1)n = e.charCodeAt(t), r += a.charAt(n >>> 4 & 15) + a.charAt(15 & n);
                    return r
                }

                function h(e) {
                    return unescape(encodeURIComponent(e))
                }

                function _(e) {
                    return u(h(e))
                }

                function y(e) {
                    return f(_(e))
                }

                function m(e, n) {
                    return p(h(e), h(n))
                }

                function v(e, n) {
                    return f(m(e, n))
                }

                function g(e, n, t) {
                    return n ? t ? m(n, e) : v(n, e) : t ? _(e) : y(e)
                }

                n.exports = g
            }()
        }, {}], 20: [function (e, n, t) {
            var a = e('./version').v, r = e('./testmode'), i = e('./callbacks'), l = e('./mods'), o = e('./stash'), c = e('./collection'), s = e('./payment_elements'), d = {}.hasOwnProperty, PingppSDK = function () {
                e('./init').init()
            };
            PingppSDK.prototype = {
                version: a, createPayment: function (e, n, t, a) {
                    if ('function' == typeof n && (i.userCallback = n), s.init(e), !d.call(s, 'id'))return void i.innerCallback('fail', i.error('invalid_charge', 'no_charge_id'));
                    if (!d.call(s, 'channel'))return void i.innerCallback('fail', i.error('invalid_charge', 'no_channel'));
                    d.call(s, 'app') && ('string' == typeof s.app ? o.app_id = s.app : 'object' == typeof s.app && 'string' == typeof s.app.id && (o.app_id = s.app.id)), c.report({
                        type: 'pure_sdk_click',
                        channel: s.channel,
                        ch_id: s.id
                    });
                    var u = s.channel;
                    if (!d.call(s, 'credential'))return void i.innerCallback('fail', i.error('invalid_charge', 'no_credential'));
                    if (!s.credential)return void i.innerCallback('fail', i.error('invalid_credential', 'credential_is_undefined'));
                    if (!d.call(s.credential, u))return void i.innerCallback('fail', i.error('invalid_credential', 'credential_is_incorrect'));
                    if (!d.call(s, 'livemode'))return void i.innerCallback('fail', i.error('invalid_charge', 'no_livemode_field'));
                    var p = l.getChannelModule(u);
                    return 'undefined' == typeof p ? (console.error('channel module "' + u + '" is undefined'), void i.innerCallback('fail', i.error('invalid_channel', 'channel module "' + u + '" is undefined'))) : s.livemode === !1 ? void(d.call(p, 'runTestMode') ? p.runTestMode(s) : r.runTestMode(s)) : ('undefined' != typeof t && (o.signature = t), 'boolean' == typeof a && (o.debug = a), void p.handleCharge(s))
                }, setAPURL: function (e) {
                    o.APURL = e
                }
            }, n.exports = new PingppSDK
        }, {
            "./callbacks": 1,
            "./collection": 17,
            "./init": 18,
            "./mods": 21,
            "./payment_elements": 22,
            "./stash": 23,
            "./testmode": 24,
            "./version": 26
        }], 21: [function (e, n, t) {
            var a = {}.hasOwnProperty, r = {};
            n.exports = r, r.channels = {
                alipay_pc_direct: e('./channels/alipay_pc_direct'),
                alipay_wap: e('./channels/alipay_wap'),
                bfb_wap: e('./channels/bfb_wap'),
                cp_b2b: e('./channels/cp_b2b'),
                fqlpay_qr: e('./channels/fqlpay_qr'),
                fqlpay_wap: e('./channels/fqlpay_wap'),
                jdpay_wap: e('./channels/jdpay_wap'),
                qpay_pub: e('./channels/qpay_pub'),
                upacp_pc: e('./channels/upacp_pc'),
                upacp_wap: e('./channels/upacp_wap'),
                wx_lite: e('./channels/wx_lite'),
                wx_pub: e('./channels/wx_pub'),
                wx_wap: e('./channels/wx_wap'),
                yeepay_wap: e('./channels/yeepay_wap')
            }, r.extras = {}, r.getChannelModule = function (e) {
                if (a.call(r.channels, e))return r.channels[e]
            }, r.getExtraModule = function (e) {
                if (a.call(r.extras, e))return r.extras[e]
            }
        }, {
            "./channels/alipay_pc_direct": 2,
            "./channels/alipay_wap": 3,
            "./channels/bfb_wap": 4,
            "./channels/cp_b2b": 6,
            "./channels/fqlpay_qr": 7,
            "./channels/fqlpay_wap": 8,
            "./channels/jdpay_wap": 9,
            "./channels/qpay_pub": 10,
            "./channels/upacp_pc": 11,
            "./channels/upacp_wap": 12,
            "./channels/wx_lite": 13,
            "./channels/wx_pub": 14,
            "./channels/wx_wap": 15,
            "./channels/yeepay_wap": 16
        }], 22: [function (e, n, t) {
            var a = e('./callbacks'), r = {}.hasOwnProperty;
            n.exports = {
                id: null,
                or_id: null,
                channel: null,
                app: null,
                credential: {},
                extra: null,
                livemode: null,
                order_no: null,
                time_expire: null,
                init: function (e) {
                    var n;
                    if ('string' == typeof e)try {
                        n = JSON.parse(e)
                    } catch (t) {
                        return void a.innerCallback('fail', a.error('json_decode_fail', t))
                    } else n = e;
                    if ('undefined' == typeof n)return void a.innerCallback('fail', a.error('json_decode_fail'));
                    if (r.call(n, 'object') && 'order' == n.object) {
                        n.or_id = n.id, n.id = n.charge, n.order_no = n.merchant_order_no;
                        var i = n.charge_essentials;
                        n.channel = i.channel, n.credential = i.credential, n.extra = i.extra
                    }
                    for (var l in this)r.call(n, l) && (this[l] = n[l]);
                    return this
                },
                clear: function () {
                    for (var e in this)'function' != typeof this[e] && (this[e] = null)
                }
            }
        }, {"./callbacks": 1}], 23: [function (e, n, t) {
            n.exports = {}
        }, {}], 24: [function (e, n, t) {
            var a = e('./utils'), r = {}.hasOwnProperty;
            n.exports = {
                PINGPP_MOCK_URL: 'http://sissi.pingxx.com/mock.php', runTestMode: function (e) {
                    var n = {ch_id: e.id, scheme: 'http', channel: e.channel};
                    r.call(e, 'or_id') && null !== e.or_id && (n.or_id = e.or_id), r.call(e, 'order_no') ? n.order_no = e.order_no : r.call(e, 'orderNo') && (n.order_no = e.orderNo), r.call(e, 'time_expire') ? n.time_expire = e.time_expire : r.call(e, 'timeExpire') && (n.time_expire = e.timeExpire), r.call(e, 'extra') && (n.extra = encodeURIComponent(JSON.stringify(e.extra))), a.redirectTo(this.PINGPP_MOCK_URL + '?' + a.stringifyData(n))
                }
            }
        }, {"./utils": 25}], 25: [function (e, n, t) {
            var a = {}.hasOwnProperty, r = n.exports = {
                stringifyData: function (e, n, t) {
                    'undefined' == typeof t && (t = !1);
                    var r = [];
                    for (var i in e)a.call(e, i) && 'function' != typeof e[i] && ('bfb_wap' == n && 'url' == i || 'yeepay_wap' == n && 'mode' == i || 'channel_url' != i && r.push(i + '=' + (t ? encodeURIComponent(e[i]) : e[i])));
                    return r.join('&')
                }, request: function (e, n, t, i, l, o) {
                    if ('undefined' == typeof XMLHttpRequest)return void console.log('Function XMLHttpRequest is undefined.');
                    var c = new XMLHttpRequest;
                    if ('undefined' != typeof c.timeout && (c.timeout = 6e3), n = n.toUpperCase(), 'GET' === n && 'object' == typeof t && t && (e += '?' + r.stringifyData(t, '', !0)), c.open(n, e, !0), 'undefined' != typeof o)for (var s in o)a.call(o, s) && c.setRequestHeader(s, o[s]);
                    'POST' === n ? (c.setRequestHeader('Content-type', 'application/json; charset=utf-8'), c.send(JSON.stringify(t))) : c.send(), 'undefined' == typeof i && (i = function () {
                    }), 'undefined' == typeof l && (l = function () {
                    }), c.onreadystatechange = function () {
                        4 == c.readyState && i(c.responseText, c.status, c)
                    }, c.onerror = function (e) {
                        l(c, 0, e)
                    }
                }, formSubmit: function (e, n, t) {
                    if ('undefined' == typeof window)return void console.log('Not a browser, form submit url: ' + e);
                    var r = document.createElement('form');
                    r.setAttribute('method', n), r.setAttribute('action', e);
                    for (var i in t)if (a.call(t, i)) {
                        var l = document.createElement('input');
                        l.setAttribute('type', 'hidden'), l.setAttribute('name', i), l.setAttribute('value', t[i]), r.appendChild(l)
                    }
                    document.body.appendChild(r), r.submit()
                }, randomString: function (e) {
                    'undefined' == typeof e && (e = 32);
                    for (var n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', t = n.length, a = '', r = 0; r < e; r++)a += n.charAt(Math.floor(Math.random() * t));
                    return a
                }, redirectTo: function (e) {
                    return 'undefined' == typeof window ? void console.log('Not a browser, redirect url: ' + e) : void(window.location.href = e)
                }, inWeixin: function () {
                    if ('undefined' == typeof navigator)return !1;
                    var e = navigator.userAgent.toLowerCase();
                    return e.indexOf('micromessenger') !== -1
                }, documentReady: function (e) {
                    return 'undefined' == typeof document ? void e() : void('loading' != document.readyState ? e() : document.addEventListener('DOMContentLoaded', e))
                }, loadUrlJs: function (e, n, t) {
                    var a = document.getElementsByTagName('head')[0], r = null;
                    null == document.getElementById(e) ? (r = document.createElement('script'), r.setAttribute('type', 'text/javascript'), r.setAttribute('src', n), r.setAttribute('id', e), r.async = !0, null != t && (r.onload = r.onreadystatechange = function () {
                        return !r.ready && void(r.readyState && 'loaded' != r.readyState && 'complete' != r.readyState || (r.ready = !0, t()))
                    }), a.appendChild(r)) : null != t && t()
                }
            }
        }, {}], 26: [function (e, n, t) {
            n.exports = {v: '2.1.8'}
        }, {}]
    }, {}, [20])(20)
});
//# sourceMappingURL=pingpp.js.map