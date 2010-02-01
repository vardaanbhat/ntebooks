    var BEGUN;
    var hyperBanners    = new Array();
    var hyperWords      = new Array();

    if ( window.stopwords != null ) {
        var stopwords = '&stopwords=' + escape( window.stopwords );
    }  else {
        var stopwords = '';
    }
    if ( window.begun_utf8 ) {
        var hyper_utf8 = '&begun_utf8=1';
    } else {
        var hyper_utf8 = '';
    }

    document.write( '<script language="JavaScript" type="text/javascript" src="http://autocontext.begun.ru/hyper.php?pad_id=' + begunhyper_auto_pad + stopwords + hyper_utf8 +'&real_refer='+escape(document.location)+'" ></s' + 'cript>' );

    function hyperRun()
    {
        if ( new Array().push ) {
            var hypercontext = document.getElementById( 'hypercontext' );
            if ( hypercontext ) {
                BEGUN = new BEGUN( hypercontext, hyperBanners, hyperWords );
                if ( window.begunhyper_auto_colors != null ) {
                    var colors = window.begunhyper_auto_colors;
                    if ( colors[ 0 ] != null ) BEGUN.design.banner.linkColor   = colors[ 0 ];
                    if ( colors[ 1 ] != null ) BEGUN.design.banner.textColor   = colors[ 1 ];
                    if ( colors[ 2 ] != null ) BEGUN.design.banner.domainColor = colors[ 2 ];
                    if ( colors[ 3 ] != null ) BEGUN.design.banner.bgColor     = colors[ 3 ];
                }
                if ( window.begun_hyper_limit     != null ) BEGUN.parameters.phraseLimit                = begun_hyper_limit;
                if ( window.begunhyper_auto_width != null ) BEGUN.design.banner.width                   = begunhyper_auto_width;
                if ( window.begun_hyper_a_color   != null ) BEGUN.design.phrase.style.color             = begun_hyper_a_color;
                if ( window.begun_underline_color != null ) BEGUN.design.phrase.style.borderBottomColor = begun_underline_color;
                if ( window.begun_hyper_a_bold    != null ) {
                    if ( window.begun_hyper_a_bold != 'normal' ) {
                        BEGUN.design.phrase.style.fontWeight = 'bold';
                    }
                }
                document.write( BEGUN.css() );
                BEGUN.start();
            }
        }
    }

    function BEGUN( container, feeds, words )
    {
        this.container  = container;
        this.hyperText  = new BEGUN_HyperText( container );
        this.hideTimer  = false;
        this.showTimer  = false;
        this.parameters = {
            'phraseLimit' : 3,
            'showTimeout' : 100,
            'hideTimeout' : 500,
            'openNewWin'  : false
        }
        this.design = {
            'banner'    : {
                'width'         : 350,
                'bgColor'       : '#FFFFE0',
                'headColor'     : '#CCCCCC',
                'linkColor'     : '#00CC00',
                'textColor'     : '#000000',
                'domainColor'   : '#CCCCCC'
            },
            'phrase'    : {
                'style' : {
                    'fontWeight'        : 'normal',
                    'color'             : '#0000FF',
                    'textDecoration'    : 'none',
                    'borderBottomWidth' : '1px',
                    'borderBottomStyle' : 'solid',
                    'borderBottomColor' : '#0000FF',
                    'cursor'            : 'pointer'
                }
            }
        }
        this.start = function()
        {
            var feedsLength = feeds.length;
            for ( var i = 0; i < feedsLength; i++ ) {
                if ( i >= this.parameters.phraseLimit ) {
                    break;
                }
                if ( typeof( feeds[ i ][ 3 ] ) == 'undefined' || ! feeds[ i ][ 3 ] ) {
                    feeds[ i ][ 3 ] = '';
                }
                var banner = new BEGUN_Banner(
                    feeds[ i ][ 0 ],
                    feeds[ i ][ 1 ],
                    feeds[ i ][ 2 ],
                    feeds[ i ][ 3 ],
                    words[ i ].split( '|' )
                );
                banner.id = this.hyperText.banners.length;
                this.hyperText.banners[ banner.id ] = banner;
            }
            this.hyperText.start( this.parameters.phraseLimit );
            this.highlight();
            var bannersLength = this.hyperText.banners.length;
            for ( var i = 0; i < bannersLength; i++ ) {
                this.container.appendChild( this.createHTMLBanner( this.hyperText.banners[ i ] ) );
                this.hyperText.banners[ i ].element.node.onmouseover    = new Function( 'BEGUN.Event_BannerOnMouseOver()' );
                this.hyperText.banners[ i ].element.node.onmouseout     = new Function( 'BEGUN.Event_BannerOnMouseOut(' + i + ')' );
            }
            var phrasesLength = this.hyperText.phrases.length;
            for ( var i = 0; i < phrasesLength; i++ ) {
                this.hyperText.phrases[ i ].element.node.onmouseover    = new Function( 'BEGUN.Event_PhraseOnMouseOver( ' + i + ')' );
                this.hyperText.phrases[ i ].element.node.onmouseout     = new Function( 'BEGUN.Event_PhraseOnMouseOut(' + i + ')' );
            }
        }
        this.Event_PhraseOnMouseOver = function( phraseIndex )
        {
            var phrase = BEGUN.hyperText.phrases[ phraseIndex ];
            phrase.element.node.style.borderBottomWidth = '2px';
            if ( BEGUN.hideTimer ) {
                clearTimeout( BEGUN.hideTimer );
                BEGUN.hideTimer = false;
            }
            BEGUN.hideAllBanners();
            BEGUN.showTimer = setTimeout(
                'BEGUN.showBanner( ' + phraseIndex + ' )',
                BEGUN.parameters.showTimeout
            );
        }
        this.Event_PhraseOnMouseOut = function( phraseIndex )
        {
            var phrase = BEGUN.hyperText.phrases[ phraseIndex ];
            var banner = phrase.banner;
            phrase.element.node.style.borderBottomWidth = '1px';
            BEGUN.hideTimer = setTimeout(
                'BEGUN.hideBanner( ' + banner.id + ' )',
                BEGUN.parameters.hideTimeout
            );
        }
        this.Event_BannerOnMouseOver = function()
        {
            if ( BEGUN.hideTimer ) {
                clearTimeout( BEGUN.hideTimer );
                BEGUN.hideTimer = false;
            }
        }
        this.Event_BannerOnMouseOut = function( bannerIndex )
        {
            BEGUN.hideTimer = setTimeout(
                'BEGUN.hideBanner( ' + bannerIndex + ' )',
                BEGUN.parameters.hideTimeout
            );
        }
        this.showBanner = function( phraseIndex )
        {
            var left, top;
            var phrase      = BEGUN.hyperText.phrases[ phraseIndex ];
            var banner      = phrase.banner;
            var winW        = phrase.element.windowWidth();
            var winH        = phrase.element.windowHeight();
            var winS        = phrase.element.windowScrollTop();
            var phraseX     = phrase.element.left();
            var phraseY     = phrase.element.top();
            var phraseW     = phrase.element.width();
            var phraseH     = phrase.element.height();
            var bannerW     = banner.element.width();
            var bannerH     = banner.element.height();
            if ( 2 * phraseX > winW - phraseW ) {
                left = phraseX -bannerW - 3;
            } else{
                left = phraseX + phraseW + 3;
            }
            if ( 2 * phraseY > winH - phraseH + 2 * winS ) {
                top = phraseY - bannerH;
            } else {
                top = phraseY + phraseH + 3;
            }
            if ( banner.element.node.parentNode.tagName != 'BODY' ) {
                var body = document.getElementsByTagName( 'BODY' )[ 0 ];
                if ( body ) {
                    body.appendChild( banner.element.node );
                }
            }
            banner.element.move( top, left );
            banner.element.show();
        }
        this.hideBanner = function( bannerIndex )
        {
            var banner = BEGUN.hyperText.banners[ bannerIndex ];
            banner.element.hide();
        }
        this.hideAllBanners = function()
        {
            var bannersLength = BEGUN.hyperText.banners.length;
            for ( var i = 0; i < bannersLength; i++ ) {
                BEGUN.hyperText.banners[ i ].element.hide();
            }
        }
        this.createHTMLPhrase = function( phrase )
        {
            var result = document.createElement( 'A' );
            if ( true || window.begun_target ) {
                result.target = '_blank';
            }
            result.appendChild( document.createTextNode( phrase.getText() ) );
            result.href = phrase.banner.url;
            for ( var property in this.design.phrase.style ) {
                result.style[ property ] = this.design.phrase.style[ property ];
            }
            phrase.element = new HTMLNodeWrapper( result );
            return phrase.element.node;
        }
        this.createHTMLBanner = function( banner )
        {
            var begun_header = '';
            begun_header += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
            begun_header += '    <tr>';
            begun_header += '        <td valign="top" style="width: 18px"><img src="http://autocontext.begun.ru/img/begun.gif" width="18" height="18" border="0" /></td>';
            begun_header += '        <td style="width: 100%; padding-left: 5px" nowrap="nowrap"><a href="http://www.begun.ru" style="color: ' + this.design.banner.headColor + '; font-size: 12px; text-decoration: none" target="_blank">Контекстная реклама</a></td>';
            begun_header += '        <td align="right" style="padding-right: 10px"><a href="http://www.begun.ru" style="color: ' + this.design.banner.headColor + '; font-size: 12px; text-decoration: none" target="_blank">Бегун</a></td>';
            begun_header += '    </tr>';
            begun_header += '</table>';
            var begun_content = '';
            begun_content += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
            begun_content += '    <tr>';
            begun_content += '        <td>';
            begun_content += '            <div style="text-align:left;"><a class="begun_hyper" target="_blank" style="color: ' + this.design.banner.linkColor + ';font-size: 10pt; text-decoration: none" href="' + banner.url + '" onclick="event.cancelBubble=true;"><b>' + banner.title + '</b></a></div>';
            begun_content += '            <div style="text-align:left;color: ' + this.design.banner.textColor   + '; font-size: 10pt">' + banner.text + '</div>';
            begun_content += '            <div style="text-align:left;color: ' + this.design.banner.domainColor + '; font-size: 10pt">' + banner.domain + '</div>';
            begun_content += '        </td>';
            begun_content += '    </tr>';
            begun_content += '    <tr><td height="10"></td></tr>';
            begun_content += '</table>';
            var result = document.createElement( 'DIV' );
            result.style.backgroundColor    = this.design.banner.bgColor;
            result.style.position           = 'absolute';
            result.style.border             = 'solid 1px #000000';
            result.style.visibility         = 'hidden';
            result.style.width              = parseInt( this.design.banner.width ) + 'px';
            result.style.top                = '0px';
            result.style.left               = '0px';
            result.style.padding            = '5px';
            result.style.zIndex             = 99999;
            result.className = 'begun_hyper';
            result.innerHTML = begun_header + begun_content;
            result.onclick = function()
            {
                var a = this.getElementsByTagName( 'A' )[ 2 ];
                if ( a.click ) {
                    a.click();
                } else {
                    if ( a.target == '_blank' ) {
                        window.open().location.href = a.href;
                    } else {
                        window.location.href = a.href;
                    }
                }
            }
            banner.element = new HTMLNodeWrapper( result );
            return result;
        }
        this.highlight = function()
        {

            var phrasesLength = this.hyperText.phrases.length;
            for ( var i = 0; i < phrasesLength; i++ ) {
                var phrase = this.hyperText.phrases[ i ];
                var phrases = phrase.fragment.phrases;
                phrases[ phrases.length ] = phrase;
            }
            var fragmentsLength = this.hyperText.fragments.length;
            for ( var i = 0; i < fragmentsLength; i++ ) {
                var index = 0;
                var nodes = new Array();
                var fragment = this.hyperText.fragments[ i ];
                var text = fragment.node.nodeValue;
                var parent = fragment.node.parentNode;
                var phrasesLength = fragment.phrases.length;
                for ( var j = 0; j < phrasesLength; j++ ) {
                    var phrase = fragment.phrases[ j ];
                    var textNode = document.createTextNode( text.substr( index, phrase.index - index ) );
                    nodes[ nodes.length ] = textNode;
                    nodes[ nodes.length ] = this.createHTMLPhrase( phrase );
                    index = phrase.index + phrase.length;
                }
                if ( text.length > index ) {
                    nodes[ nodes.length ] = document.createTextNode( text.substr( index ) );
                }
                var prevNode = fragment.node;
                while ( nodes.length > 0 ) {
                    prevNode = parent.insertBefore( nodes.pop(), prevNode );
                }
                parent.removeChild( fragment.node );
            }
        }
        this.css = function()
        {
            var result = '';
            result += '<style><!--';
            result += '.begun_hyper, .begun_hyper * {';
            result += '    font-family: Arial, Tahoma, sans-serif;';
            result += '    cursor: pointer';
            result += '}';
            result += 'A.begun_hyper:link,A.begun_hyper:visited,A.begun_hyper:hover,A.begun_hyper:active {';
            result += '    color: ' + this.design.banner.linkColor;
            result += '}';
            result += '--></style>';
            return result;
        }
    }

    function BEGUN_Fragment( node, offset )
    {
        this.node       = node;
        this.text       = node.nodeValue;
        this.offset     = offset;
        this.phrases    = new Array();
    }

    function BEGUN_Banner( title, text, url, domain, words )
    {
        this.phrasesCount = 0;
        this.title      = title;
        this.text       = text;
        this.url        = url;
        this.domain     = domain;
        this.element    = null;
        this.phrases    = new Array()
        var regexpWordBorder    = '(^|$|[^0-9a-zA-Zа-яА-Я_])';
        var regexpPattern       = regexpWordBorder + '(' + words.join( '|' ) + ')' + regexpWordBorder;
        this.regexp             = new RegExp( regexpPattern, 'ig' );
        this.findPhrases = function( fragment )
        {
            var result = this.regexp.exec( fragment.text );
            if ( result != null ) {
                this.regexp.lastIndex -= result[ result.length - 1 ].length;
                return new BEGUN_Phrase(
                    this,
                    fragment,
                    result.index + result[ 1 ].length,
                    result[ 2 ].length
                );
            }
            return false;
        }
    }

    function BEGUN_Phrase( banner, fragment, index, length )
    {
        this.banner     = banner;
        this.fragment   = fragment;
        this.index      = index;
        this.length     = length;
        this.density    = null;
        this.element    = null;
        this.rating     = 0;
        this.space      = fragment.offset + index;
        this.banner.phrasesCount++;
        this.getText = function()
        {
            return this.fragment.text.substr(
                this.index,
                this.length
            );
        }
    }

    function BEGUN_HyperText( container )
    {
        this.container      = container;
        this.fragments      = new Array();
        this.banners        = new Array();
        this.phrases        = new Array();
        this.viewType       = 1;
        this.start = function( limit )
        {
            this.findPhrases( this.container, 0 );
            var cmp = function( a, b ) { return a.space - b.space };
            this.phrases = this.phrases.sort( cmp );
            this.deleteCrossing();
            this.combineRelatives();
            var phrasesLength = this.phrases.length;
            for ( var i = 0; i < phrasesLength; i++ ) {
                this.calculatePhrasesDensity( i );
            }
            if ( this.viewType == 1 ) {
                this.deleteMoreThanOne();
            } else {
                this.cleanForBestView( limit );
            }
        }
        this.isLegalNode = function( node )
        {
            var regexp = new RegExp( '^(a|h1|h2|h3|h4|h5|h6|big)$', 'i' );
            if ( node.tagName && node.tagName.search( regexp ) != -1 ) {
                return false;
            }
            return true;
        }
        this.findPhrases = function( parent, offset )
        {
            if ( parent.hasChildNodes() ) {
                for ( var i = 0; i < parent.childNodes.length; i++ ) {
                    if ( parent.childNodes[ i ].nodeType == 3 ) {
                        var fragment = new BEGUN_Fragment( parent.childNodes[ i ], offset );
                        this.fragments[ this.fragments.length ] = fragment;
                        var bannersLength = this.banners.length;
                        for ( var j = 0; j < bannersLength; j++ ) {
                            this.banners[ j ].regexp.lastIndex = 0;
                            while ( ( phrase = this.banners[ j ].findPhrases( fragment ) ) != false ) {
                                this.phrases[ this.phrases.length ] = phrase;
                            }
                        }
                        offset = offset + fragment.text.length;
                    } else {
                        if ( this.isLegalNode( parent.childNodes[ i ] ) ) {
                            offset = this.findPhrases( parent.childNodes[ i ], offset );
                        }
                    }
                }
            }
            return offset;
        }
        this.deletePhrase = function( i )
        {
            i = parseInt( i );
            this.phrases[ i ].banner.phrasesCount--;
            this.phrases.splice( i, 1 );
            this.calculatePhrasesDensity( i );
            this.calculatePhrasesDensity( i - 1 );
        }
        this.calculatePhrasesDensity = function( i )
        {
            i = parseInt( i );
            if ( 0 <= i && i < this.phrases.length ) {
                var count = 0;
                this.phrases[ i ].density = 0;
                if ( i > 0 ) {
                    this.phrases[ i ].density += this.phrases[ i ].space - this.phrases[ i - 1 ].space;
                    count++;
                }
                if ( i < this.phrases.length - 1 ) {
                    this.phrases[ i ].density += this.phrases[ i + 1 ].space - this.phrases[ i ].space;
                    count++;
                }
                if ( count > 1 ) {
                    this.phrases[ i ].density /= count;
                }
            }
        }
        this.deleteCrossing = function()
        {
            var i = 1;
            while ( i < this.phrases.length ) {
                curr = this.phrases[ i ];
                prev = this.phrases[ i - 1 ];
                if ( prev.space + prev.length > curr.space ) {
                    if ( curr.banner.phrasesCount > prev.banner.phrasesCount ) {
                        this.deletePhrase( i );
                    } else {
                        this.deletePhrase( i - 1 );
                    }
                } else {
                    i++;
                }
            }
        }
        this.combineRelatives = function()
        {
            var i = 1;
            var regexp = new RegExp( '^(\\s|-|\\+|/|&#150;|&nbsp;|&|[0-9a-zа-я]){1,14}$', 'i' );
            while ( i < this.phrases.length ) {
                curr = this.phrases[ i ];
                prev = this.phrases[ i - 1 ];
                if ( curr.banner == prev.banner && curr.fragment == prev.fragment ) {
                    var lining = curr.fragment.text.substr( prev.index + prev.length, curr.index - prev.index - prev.length );
                    if ( regexp.test( lining ) ) {
                        prev.length = prev.length + lining.length + curr.length;
                        this.deletePhrase( i );
                        continue;
                    }
                }
                i++;
            }
        }
        this.deleteMoreThanOne = function()
        {
            var phrasesLength = this.phrases.length;
            for ( var i = 0; i < phrasesLength; i++ ) {
                var phrase = this.phrases[ i ];
                phrase.banner.phrases[ phrase.banner.phrases.length ] = phrase;
            }
            var bannersLength = this.banners.length;
            for ( var i = 0; i < bannersLength; i++ ) {
                if ( this.banners[ i ].phrases.length > 0 ) {
                    var maxDensity  = 0;
                    var maxLength   = 0;
                    var maxRating   = 0;
                    var maxSpace    = 0;
                    var minSpace    = Number.POSITIVE_INFINITY;
                    var bestPhrase  = this.banners[ i ].phrases[ 0 ];
                    var phrasesLength = this.banners[ i ].phrases.length;
                    for ( var j = 0; j < phrasesLength; j++ ) {
                        var phrase = this.banners[ i ].phrases[ j ];
                        if ( phrase.space < minSpace ) minSpace = phrase.space;
                        if ( phrase.space > maxSpace ) maxSpace = phrase.space;
                        if ( phrase.length > maxLength ) maxLength = phrase.length;
                        if ( phrase.density > maxDensity ) maxDensity = phrase.density;
                    }
                    var phrasesLength = this.banners[ i ].phrases.length;
                    for ( var j = 0; j < phrasesLength; j++ ) {
                        var phrase = this.banners[ i ].phrases[ j ];
                        var kD = phrase.density / maxDensity;
                        var kL = phrase.length / maxLength;
                        var kS = ( maxSpace + minSpace - phrase.space ) / maxSpace;
                        var kR = kL * 100 + kD * 10 + kS;
                        if ( kR > maxRating ) {
                            maxRating = kR;
                            bestPhrase = phrase;
                        }
                    }
                    bestPhrase.rating = 1;
                }
            }
            var cmpRating = function( a, b ) { return b.rating - a.rating };
            this.phrases = this.phrases.sort( cmpRating );
            while ( this.phrases.length > this.banners.length ) {
                this.deletePhrase( this.phrases.length - 1 );
            }
            var cmpSpace = function( a, b ) { return a.space - b.space };
            this.phrases = this.phrases.sort( cmpSpace );
        }
        this.cleanForBestView = function( limit )
        {
            while ( this.phrases.length > limit ) {
                var index = null;
                var minDensity = Number.POSITIVE_INFINITY;
                var phrasesLength = this.phrases.length;
                for ( var i = 0; i < phrasesLength; i++ ) {
                    if (  this.phrases[ i ].banner.phrasesCount > 1 ) {
                        if ( minDensity > this.phrases[ i ].density ) {
                            index = i;
                            minDensity = this.phrases[ i ].density;
                        }
                    }
                }
                if ( index == null ) {
                    break;
                }
                this.deletePhrase( index );
            }
        }
    }

    function HTMLNodeWrapper( node )
    {
        this.node = node;
        if ( document.all ) {
            this.browser = 'ie';
        } else {
            if ( navigator.userAgent.indexOf( 'Opera' ) > -1 ) {
                this.browser = 'opera';
            } else {
                this.browser = 'mozilla';
            }
        }
        this.top = function()
        {
            return _sumProperty( this.node, 'offsetTop' );
        }
        this.left = function()
        {
            return _sumProperty( this.node, 'offsetLeft' );
        }
        this.width = function()
        {
            return this.node.offsetWidth;
        }
        this.height = function()
        {
            return this.node.offsetHeight;
        }
        this.show = function()
        {
            this.node.style.visibility = 'visible';
        }
        this.hide = function()
        {
            this.node.style.visibility = 'hidden';
        }
        this.move = function( top, left )
        {
            this.node.style.top     = parseInt( top ) + 'px';
            this.node.style.left    = parseInt( left ) + 'px';
        }
        this.windowWidth = function()
        {
            if ( this.browser == 'ie' ) {
                return window.document.body.clientWidth;
            }
            return window.innerWidth;
        }
        this.windowHeight = function()
        {
            if ( this.browser == 'ie' ) {
                return window.document.body.clientHeight;
            }
            return window.innerHeight;
        }
        this.windowScrollTop = function()
        {
            return document.body.scrollTop;
        }
        function _sumProperty( node, propertyName )
        {
            var result = 0;
            while( node.offsetParent ) {
                result += node[ propertyName ];
                node = node.offsetParent;
            }
            return result;
        }
    }
