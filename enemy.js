/*
 * enemy.js
 *
 * Defines basic enemy types.
 *
 *
 */

var Enemy = me.ObjectEntity.extend({
    init: function( x, y, settings )
    {
        settings.image        = settings.image        || 'testenemy';
        settings.spritewidth  = settings.spritewidth  || 48;
        settings.spriteheight = settings.spriteheight || 48;

        this.parent( x, y, settings );
        this.gravity = 0;
        this.type = me.game.ENEMY_TYPE;
        this.collidable = true;
        this.playerCollidable = true;

        this.origVelocity = 6;
        this.setMaxVelocity( this.origVelocity, this.origVelocity );

        this.hp = 3;

        this.directionString = "down";
    },

    updateDirectionString: function()
    {
        if ( this.vel.y > 0.0 )
            this.directionString = "down";
        if ( this.vel.y < 0.0 )
            this.directionString = "up";
        if ( this.vel.x > 0.0 )
            this.directionString = "right";
        if ( this.vel.x < 0.0 )
            this.directionString = "left";
    },

    /** Get a vector to the player. */
    toPlayer: function()
    {
        if( me.game.player ) {
            return new me.Vector2d(
                me.game.player.pos.x
                    + me.game.player.width / 2
                    - this.pos.x - this.width / 2,
                me.game.player.pos.y
                    + me.game.player.height / 2
                    - this.pos.y - this.height / 2
            );
        }
        return;
    },

    onCollision: function( res, obj )
    {
        if( obj.type == "weakAttack" )
        {
            this.knockback( 1, 2.0, 30 );
        }
        else if ( obj.type == "strongAttack" )
        {
            this.knockback( 2, 10.0, 60 );
        }
        else if ( obj == me.game.player && me.game.player.isDashing() )
        {
            this.knockback( 0, 6.0, 0 );
        }
    },

    knockback: function( damage, amt, length )
    {
        this.hp -= damage;
        me.audio.play( "hit" );

        // death
        if ( this.hp <= 0 )
        {
            var dPosX = this.pos.x + ( this.width / 2 ) - 48;
            var dPosY = this.pos.y + ( this.height / 2 ) - 48;
            var deathPart = new PlayerParticle( dPosX, dPosY, "die", 96, 5, [ 0, 1, 2, 3, 4, 5 ], "", false );
            me.game.add( deathPart, this.z + 1 );
            me.game.remove( this );
            me.game.sort();
            me.audio.play( this.deathSound );
            return;
        }

        var knockback = amt;

        if ( length > 0 && amt > 0 )
        {
            this.setMaxVelocity( knockback, knockback );

            this.collidable = false;
            this.flicker( length, function()
            { this.setMaxVelocity( this.origVelocity, this.origVelocity );
                this.collidable = true; } );

            this.vel.x += this.toPlayer().x * knockback * -0.5;
            this.vel.y += this.toPlayer().y * knockback * -0.5;
        }
    },

    fireBullet: function( image, velMult )
    {
        // note collide is false as the player checks its own collision, bullet will be recipient & get oncollision call
        var bPosX = this.pos.x + ( this.width / 2 ) - 24;
        var bPosY = this.pos.y + ( this.height / 2 ) - 24;
        var bullet = new EnemyBullet( bPosX, bPosY, image || "shooterBullet", 48, 5, [ 0 ], "shooterBullet", false, 48 );
        var dir = this.toPlayer();
        dir.normalize();
        bullet.vel.x = dir.x * ( velMult || 5.0 );
        bullet.vel.y = dir.y * ( velMult || 5.0 );
        me.game.add( bullet, this.z + 1 );
        me.game.sort();
        me.audio.play( "shoot" );
    },

    isStuck: function( colres)
    {
        var val = ( this.pos.x == this.lastPosX &&
            this.pos.y == this.lastPosY && ( colres.x != 0 || colres.y != 0 ) );

        this.lastPosX = this.pos.x;
        this.lastPosY = this.pos.y;

        return val;
    }
});

var Hugger = Enemy.extend({
    init: function( x, y, settings )
    {
        this.range = settings.range || 350;
        this.speed = settings.speed || .6;
        settings.image = settings.image || "hugger";
        this.parent( x, y, settings );

        this.hp = 3;

        this.setFriction( 0.35, 0.35 );

        this.isAttached = false;

        this.deathSound = "hugdeath";

        this.posDiffX = 0;
        this.posDiffY = 0;

        var directions = [ "down", "left", "up", "right" ];
        for ( var i = 0; i < directions.length; i++ )
        {
            var index = i * 4;
            this.addAnimation( directions[ i ] + "run",
                [ index, index + 1, index, index + 2 ] );
            this.addAnimation( directions[ i ] + "grab", [ index + 3 ] );
        }
    },

    onCollision: function( res, obj )
    {
        this.parent( res, obj );

        // attach if player collision
        if ( obj == me.game.player && !me.game.player.isDashing() )
        {
            me.audio.play( "grab" );
            this.isAttached = true;
            this.posDiffX = me.game.player.pos.x - this.pos.x;
            this.posDiffY = me.game.player.pos.y - this.pos.y;
            this.collidable = false;
            obj.addAttached( this );
        }
    },

    shakeOff: function()
    {
        this.isAttached = false;
        this.flicker( 60, function() { this.collidable = true } );
    },

    /** Run towards the player when it's in range. */
    update: function()
    {
        //this.parent( this );
        this.updateDirectionString();

        if ( this.isAttached )
        {
            this.setCurrentAnimation( this.directionString + "grab" );
            this.pos.x = me.game.player.pos.x - this.posDiffX;
            this.pos.y = me.game.player.pos.y - this.posDiffY;
            this.vel.x = 0;
            this.vel.y = 0;
        }
        else if ( this.collidable )
        {
            var direction = this.toPlayer();
            var move = false;
            if( direction ) {
                var dist = direction.length();
                if( dist < this.range && dist > 0) {
                    this.setCurrentAnimation( this.directionString + "run" );
                    direction.normalize();
                    this.vel.x += direction.x * this.speed;
                    this.vel.y += direction.y * this.speed;
                    this.direction = direction;
                    move = true;
                }
            }

            // disabling this for now
            if( ! move ) {
                //this.vel.x = 0;
                //this.vel.y = 0;
            }
        }

        this.updateMovement();

        // need to check collidable to finish flicker?
        if ( move || !this.collidable )
            this.parent( this );
        return move;
    }
});

var Pusher = Enemy.extend({
    init: function( x, y, settings ) {
        this.range = settings.range || 200;
        this.speed = settings.speed || .6;
        settings.image = "pusher";
        settings.spritewidth = 96;
        settings.spriteheight = 96;

        this.parent( x, y, settings );

        this.animationspeed = 3;

        this.pushTimer = 0;

        this.hp = 10;

        this.deathSound = "pushdeath";

        this.updateColRect( 32, 32, 10, 86 );

        if( settings.direction == 'left' ) {
            this.direction = new me.Vector2d( -1, 0 );
        }
        else if( settings.direction == 'right' ) {
            this.direction = new me.Vector2d( 1, 0 );
        }
        else if( settings.direction == 'up' ) {
            this.direction = new me.Vector2d( 0, -1 );
        }
        else if( settings.direction == 'down' ) {
            this.direction = new me.Vector2d( 0, 1 );
        }
        else {
            throw "Pusher needs a direction.";
        }

        var directions = [ "down", "left", "up", "right" ];
        for ( var i = 0; i < directions.length; i++ )
        {
            var index = i * 4;
            this.addAnimation( directions[ i ] + "idle", [ index ] );
            this.addAnimation( directions[ i ] + "run",
                [ index, index + 1, index, index + 2 ] );
            this.addAnimation( directions[ i ] + "push", [ index + 3 ] );
        }
    },

    onCollision: function( res, obj )
    {
        this.parent( res, obj );
        if ( obj == me.game.player && !me.game.player.isDashing() )
        {
            me.game.player.vel.x += this.direction.x * 10.0;
            me.game.player.vel.y += this.direction.y * 10.0;
            this.pushTimer = 10;
            me.audio.play( "push" );
        }
    },

    /* When the player gets close, move in a straight line */
    update: function() {
        this.updateDirectionString();
        this.parent( this );

        if ( this.pushTimer > 0 )
            this.pushTimer--;

        var direction = this.toPlayer();
        var move = false;
        if( direction ) {
            var dist = direction.length();
            if( dist < this.range && dist > 0) {
                this.vel.x += this.speed * this.direction.x;
                this.vel.y += this.speed * this.direction.y;
            }
        }

        if ( this.pushTimer > 0 )
        {
            this.setCurrentAnimation( this.directionString + "push" );
        }
        else if ( this.vel.x || this.vel.y )
        {
            this.setCurrentAnimation( this.directionString + "run" );
        }
        else
        {
            this.setCurrentAnimation( this.directionString + "idle" );
        }

        var colres = this.updateMovement();

        if ( this.isStuck( colres ) )
        {
            this.direction.x *= -1.0;
            this.direction.y *= -1.0;
        }

        return ( this.vel.x || this.vel.y );
    }
});

