window.onload = init;
var context;// will be used to hold an AudioContext object
//global audio sources for each instrument
var source1;
var source2;
var source3;

//global var for html 5 canvas
var canvas;

//gloabel GainNodes to control
var drumGain;

//store audio buffers to access them globally -AA
var audioClipBuffers;

var bufferLoader;

function init() {
    
  // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    //hide stop button
    $('#stop').addClass('hidden');
    
    
    //create an AudioContext for audio processing in browser
    context = new AudioContext();
    //user BufferLoader object to load in sounds
    bufferLoader = new BufferLoader(
        context,
        [
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235047/metalomaticaudio/DrumBeat_1_wy1hpy.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235047/metalomaticaudio/DrumBeat_2_yeulem.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235049/metalomaticaudio/DrumBeat_3_q4aqqr.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235048/metalomaticaudio/HeavyRiff_1_ymosgj.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235047/metalomaticaudio/HeavyRiff_2_ulukzc.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235048/metalomaticaudio/HeavyRiff_3_z4nj4t.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235048/metalomaticaudio/LeadLick_1_cdxuuj.mp3',
			'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235199/metalomaticaudio/LeadLick_2_lvrw2s.mp3',
            'https://res.cloudinary.com/dgxueyjws/video/upload/v1565235199/metalomaticaudio/LeadLick_3_oabagj.mp3'
            
            
        ],
    finishedLoading
    );
    bufferLoader.load();
    

}



function finishedLoading(bufferList) {
    //make bufferList global to change the sources from other functions
    audioClipBuffers = bufferList;
    
    // Create three sources to be able to play them together
    source1 = context.createBufferSource();
    source2 = context.createBufferSource();
    source3 = context.createBufferSource();
    
    
    //create gainNodes for each insrument
    drumGain = context.createGain();
    source1.connect(drumGain);
    
    //send the sound to the destination (speakers)
    source1.connect(context.destination);
    source2.connect(context.destination);
    source3.connect(context.destination);
    

}

function setClipSources(){
    //get a list of all the radio buttons
    var drums = document.drums.drums;
    var heavyGits = document.heavy.heavy;
    var leadGits = document.lead.lead;
    
    //check which is selected and set the source accordingly.
    for(var i = 0; i < drums.length; ++i){
		
        if(drums[i].checked){
            //if user selected "No Drums" option
            if(drums[i].value == 'x'){
                source1.buffer = null;
            }
            //else set source1
            source1.buffer = audioClipBuffers[drums[i].value];
        }
    }
    
    for(var i = 0; i < heavyGits.length; ++i){
        if(heavyGits[i].checked){
            //if user selects no Heavy Guitar
            if(heavyGits[i].value == "x"){
                source2.buffer= null;
            }
            source2.buffer = audioClipBuffers[heavyGits[i].value];
        }
    }
    for(var i = 0; i < leadGits.length; ++i){
        if(leadGits[i].checked){
            //if user selects no lead Guitar
            if(leadGits[i].value == "x"){
                source3.buffer= null;
            }
            source3.buffer = audioClipBuffers[leadGits[i].value];
        }
    }
    
    source1.loop = true;
    source2.loop = true;
    source3.loop = true;
    
}

function play(){
    //set the audio sources 
    setClipSources();
    //start sounds to play in 0 sec
    source1.start(0);
    source2.start(0);
    source3.start(0);
    
    $('#play').addClass('hidden');
    $('#stop').removeClass('hidden');
    $('.sheet').addClass('animated');
    
}
function stop(){
        //stop sounds to play in 0 sec
    source1.stop(0);
    source2.stop(0);
    source3.stop(0);
    finishedLoading(audioClipBuffers);
    $('#stop').addClass('hidden');
    $('#play').removeClass('hidden');
    $('.sheet').removeClass('animated');
}


function paintCanvas(){
    var git1img = new Image();
    git1img.src= "images/guitarist1.png";
    canvas = document.getElementById("canvas");
    
    var guitaristUn = sprite({
        context: canvas.getContext("2d"),
        width:100,
        height:100,
        image:git1img
    });
    guitaristUn.render();
    
}

function sprite(options){
    var that = {};
    that.context = options.context;
    that.width= options.width;
    that.height = options.height;
    that.image = options.image;
    
    that.render = function(){
        that.context.drawImage(that.image, 0, 0, that.width, that.height, 0, 0, that.width, that.height);
    };
    
    return that;
}

