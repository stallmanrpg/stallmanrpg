/*
 * gameResources.js
 *
 * Defines game resources (maps, images, sounds) for the game.
 *
 * @author Adhesion
 */

var gameResources = [
    { name: "hugger", type: "image", src: "data/hugger_windows.png" },
    { name: "pusher", type: "image", src: "data/bill_pusher.png" },
    { name: "shooter", type: "image", src: "data/shooter.png" },

    { name: "player", type: "image", src: "data/avatar_stall.png" },
    { name: "weakAttack", type: "image", src: "data/weakAttack.png" },
    { name: "strongAttack_front", type: "image", src: "data/strongAttack_front.png" },
    { name: "strongAttack_side", type: "image", src: "data/strongAttack_side.png" },
    { name: "dash", type: "image", src: "data/dash.png" },
    { name: "die", type: "image", src: "data/money_chang.png" },
    { name: "shooterbullet", type: "image", src: "data/shooterBullet.png" },

    { name: "metatiles35x35", type: "image", src: "data/metatiles35x35.png" },
    { name: "hyposis_tileset", type: "image", src: "data/hyposis_tileset.png" },
    { name: "bg1", type: "image", src: "data/bg1.jpeg" },

    { name: "level1", type: "tmx", src: "data/levelx2.tmx" },


    { name: "dash", type: "audio", src: "data/", channels : 2 },
    //{ name: "death", type: "audio", src: "data/", channels : 2 },
    { name: "bullethit", type: "audio", src: "data/", channels : 2 },
    { name: "grab", type: "audio", src: "data/", channels : 2 },
    { name: "hit", type: "audio", src: "data/", channels : 2 },
    { name: "hugdeath", type: "audio", src: "data/", channels : 2 },
    { name: "ping", type: "audio", src: "data/", channels : 2 },
    { name: "push", type: "audio", src: "data/", channels : 2 },
    { name: "pushdeath", type: "audio", src: "data/", channels : 2 },
    { name: "strongattack", type: "audio", src: "data/", channels : 2 },
    { name: "weakattack0", type: "audio", src: "data/", channels : 2 },
    { name: "weakattack1", type: "audio", src: "data/", channels : 2 },
    { name: "shoot", type: "audio", src: "data/", channels : 2 },
    { name: "shootdeath", type: "audio", src: "data/", channels : 2 },
    
    { name: "stallbeat", type: "audio", src: "data/", channels : 2 },
];
