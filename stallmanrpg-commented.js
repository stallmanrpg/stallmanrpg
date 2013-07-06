/*
* StallmanRPG.js
*
* Main js for StallmanRPG 
* melonJS framework - http://melonjs.org/
* based on the Ludum Dare competitors 'Radmars' project 'the Brink' - http://radmars.com/theBrink/sub/ - I have preserved the original programmers comments and denoted them as 'Radmars said'
*/

//Load JS and upon load do the following
var jsApp = {
    onload: function()
    {
	//If we are not able to call melonJS (me.) to start a game with a 640x480 window
        if ( !me.video.init( 'game', 640, 480) )
        {
		//Display alert regarding HTML compatibility
            alert( "Sorry, it appears your browser does not support HTML5." );
            return;
        }
	//Load either mp3 or ogg sound files depending on browser
        me.audio.init( "mp3,ogg" );
	//Set game state to LOADING
        me.loader.onload = this.loaded.bind( this );
        me.loader.preload( gameResources );
 
        me.state.change( me.state.LOADING );
    },
//When the game has been loaded, perform the following function
    loaded: function()
    {
	//When the game state for PLAY and the scene from the PlayScreen function below is loaded
        me.state.set( me.state.PLAY, new PlayScreen() );

	//Add the entities referenced in our enemy.js file
        me.entityPool.add( "player", Player );
        me.entityPool.add( "hugger", Hugger );
        me.entityPool.add( "pusher", Pusher );
		//Change the state of me to 'PLAY' and disable rendering the HitBox (enable for debugging)
		me.state.change( me.state.PLAY);
        me.debug.renderHitBox = false;
    }
};

//Create the PlayScreen 
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

        me.audio.stopTrack;
        if ( level != "testlevel" ) // 
            //me.audio.playTrack( level );

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
