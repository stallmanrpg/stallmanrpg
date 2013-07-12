/*
* StallmanRPG.js
*
* Main js for StallmanRPG
*/


var jsApp = {
    onload: function()
    {
        if ( !me.video.init( 'game', 769, 367) )
        {
            alert( "Sorry, it appears your browser does not support HTML5." );
            return;
        }

        me.audio.init( "mp3,ogg" );

        me.loader.onload = this.loaded.bind( this );
        me.loader.preload( gameResources );

        me.state.change( me.state.LOADING );
    },

    loaded: function()
    {
     
	me.state.set( me.state.INTRO, new IntroScreen() );
        me.state.set( me.state.PLAY, new PlayScreen() );


        me.entityPool.add( "player", Player );
        me.entityPool.add( "hugger", Hugger );
        me.entityPool.add( "pusher", Pusher );
		
		me.state.change( me.state.INTRO);
        me.debug.renderHitBox = false;
    }
};

var IntroScreen = me.ScreenObject.extend({
    init: function() {
        this.parent( true );
        this.counter = 0;
    },

    onResetEvent: function() {
	var fade = '#000000';
        var duration = 1000;
        /*if( ! this.title ) {
            this.bg= me.loader.getImage("intro_bg");
        }*/

        me.input.bindKey( me.input.KEY.ENTER, "enter", true );
        //me.audio.playTrack( "stallbeat" );
	me.game.viewport.fadeOut(fade,duration);
    },

    update: function() {
        if( me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        if ( this.counter < 100 )
        {
            this.counter++;
        }else{
            me.state.change(me.state.PLAY);
        }
        me.game.repaint();
    },

    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.audio.stopTrack();
    }
});


var PlayScreen = me.ScreenObject.extend({
    init: function()
    {
	this.startTime = 60.0; 
        this.parent( true, true );
    },

    getLevel: function()
    {
        return this.parseLevel( me.levelDirector.getCurrentLevelId() );
    },

    parseLevel: function( input )
    {
        var re = /level(\d+)/;
        var results = re.exec( input );
        return parseInt(results[1]);
    },
    

    changeLevel: function( level )
    {
        var fade = '#000000';
        var duration = 1000;

        me.levelDirector.loadLevel( level );
        me.game.sort();
        me.game.viewport.fadeOut( fade, duration, function() {
 
        });
        
    },

    getCurrentMusic: function()
    {

    },

    startLevel: function( level )
    {
        var fade = '#000000';
        var duration = 500;
        
        //if ( level != "testlevel" ) // 
            //me.audio.playTrack( level );
        me.audio.playTrack( "stallbeat" );

        me.game.viewport.fadeIn(
            fade,
            duration,
            this.changeLevel.bind(this, level)
        );
    },

    // this will be called on state change -> this
    onResetEvent: function()
    {
        me.game.addHUD( 0, 0, me.video.getWidth(), me.video.getHeight() );
        this.startLevel( location.hash.substr(1) || "level1" );
    },

    onDestroyEvent: function()
    {
        me.game.disableHUD();
    }
});

window.onReady( function()
{
    jsApp.onload();
});
