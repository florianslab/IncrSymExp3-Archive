var Parameters = {},
    URLParameters = window.location.search.replace("?", "").split("&");

for (parameter in URLParameters) Parameters[URLParameters[parameter].split("=")[0]] = URLParameters[parameter].split("=")[1];

var shuffleSequence = seq("id", "instruction", "practice", rshuffle("test"));

if (Parameters.hasOwnProperty("Home")) shuffleSequence = seq("home");

//var practiceItemTypes = ["practice"];
var showProgressBar = false;
//var manualSendResults = true;
var practiceItemTypes = ["practice"];

var defaults = [
    "DynamicQuestion", {
        answers: {},
        scale: "<div><p id='scale' style='margin: 2em; text-align: center;'>Completely unnatural "+
               "<input type='radio' name='nat' value='0' /> "+
               "<input type='radio' name='nat' value='1' /> "+
               "<input type='radio' name='nat' value='2' /> "+
               "<input type='radio' name='nat' value='3' /> "+
               "<input type='radio' name='nat' value='4' /> "+
               "<input type='radio' name='nat' value='5' /> "+
               "<input type='radio' name='nat' value='6' /> "+
               " Completely natural</p>"+
               "<a class='DynamicQuestion-fake-link' id='click'>Click here to continue</a></div>"
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    }
];

/*function get_sentence(sentence){
    return $("<p id='sentence' style='font-family: Sans serif; font-size: 1.6em; margin-bottom: 30px;'>"+sentence+".</p>");
}

function get_context(context){
    return $("<p>").append($("<p id='context' style='font-style: Sans serif; font-size: 1.5em;'>"+context+".</p>"));
    //.append($("<p style='font-family: Sans serif; font-style: italic; font-size: 1.3em; margin-bottom: 20px;'>This leads me to conclude</p>"))
}*/


function get_sentence(context, test){
    if (!context.match(/\.$/)) context += '.';
    if (!test.match(/\.$/)) test += '.';
    while (context.match(/(\s+\.|\.\.+)$/))                // Using a while because e.g. "sentence. " becomes "sentence. ." (see 'if' on context right above)
        context = context.replace(/\s*\.+$/,'.');   // and applying replace only once would then output "sentence.." (Florian's remark re item 10 on Slack)
    while (test.match(/(\s+\.|\.\.+)$/))
        test = test.replace(/\s*\.+$/,'.');
    return $("<p id='sentence' style='font-family: Sans serif; font-size: 1.6em; margin-bottom: 30px;'><span id='context'>"+context+"</span> "+
             "<span id='test'>"+test+"</span></p>");
}


function send_answer(answer, t){
    t.finishedCallback([[
                         ["Question", t.question],
                         ["Answer", answer],
                         ["Time", Date.now()-t.creationTime]
                      ]]);
}

function clickButton(callback) {
    var clicked = false;
    return function(t){ 
             $("#click").bind("click", function(){
                 if (clicked) return;
                 var checked = false;
                 $("input").each(function(){
                     if ($(this).is(":checked")){
                         callback($(this).attr("value"), t);
                         checked = true;
                     }    
                 });
                 if (!checked) alert("You have to check one of the radio buttons");
                 else clicked = true;
             });
           };
}


var items = [

    /*["home", "Message", {
        html: "<div style='text-align:center;'>"+
              "<p style='font-weight:bold;'>Please select which version of the experiment you want to access.</p>"+
              "<table style='margin: auto;'>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0000'>Group 1</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0002'>Group 3</a></td></tr>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0001'>Group 2</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0003'>Group 4</a></td></tr>"+
              "</table>"+
              "<p>Debug version (showing condition label):</p>"+
              "<table style='margin: auto;'>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0000&Debug=T'>Group 1</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0002&Debug=T'>Group 3</a></td></tr>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0001&Debug=T'>Group 2</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0003&Debug=T'>Group 4</a></td></tr>"+
              "</table>"+
              "(You can enter whatever as a Prolific ID on the first page)"+
              "</div>",
        transfer: null
    }],*/

    //["instruction", "__SetCounter__", {}],
    
    //["instruction", "Form", {html: {include: "ProlificConsentForm.html"}}],

    ["id", "Form", {html: {include: "ID.html"}, continueOnReturn: true}],
    
    ["instruction", "DynamicQuestion", {
        legend: "instruction",
        //context: get_context("A horse walks into a bar"),
        sentence: get_sentence("A horse walks into a bar.", "The bartender asks: 'Why the long face?'"),
        enabled: false,
        sequence: [
            TT("#bod", "In this experiment, you will see short texts.", "Press Space", "mc"),
            {pause: "key\x01"},            
            {this: "sentence"},
            TT("#sentence", "Your role will be to evaluate how naturally the texts could occur in a discourse.", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#bod", "Let's practice a bit so that you get a better idea of the task.", "Press Space", "mc"),
            {pause: "key\x01"},
            function(t){ t.finishedCallback(); }
        ]
    }],
    
    ["practice", "DynamicQuestion", {
        legend: "practice1",
        //context: get_context("Natalie is from the USA"),
        sentence: get_sentence("Natalie is from the USA.", "She lives in New York and likes to run"),
        enabled: false,
        sequence: [
            {pause: 300},
            {this: "sentence"},
            {pause: 300},
            TT("#sentence", "Nothing sounds off in this text...", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#sentence", "... it first says where Natalie is from, and further elaborates on where she lives and on her hobbies.", "Press Space", "bc"),
            {pause: "key\x01"},
            {this: "scale"},
            clickButton(
                function(answer, t) { 
                    t.response = answer;
                    if (answer < 3) TT("#click", "Wrong: the text is natural.", "Press Space", "bc")(t);
                    else TT("#click", "Right: the text is natural.", "Press Space", "bc")(t);
                }
            ),
            function(t){ $("#click, #scale input").attr("disabled", true); },
            TT("#scale", "Indicate on this scale how natural you think it would be for this text to form part of a discourse.", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#sentence", "In this case, you want to report that this text sounds natural.", "Press Space and click on the scale", "bc"),
            {pause: "key\x01"},
            function(t) { 
                var clicked = false;
                $("#scale input").click(function(){ 
                    if (clicked) return;
                    TT("#click", "Now click here to continue.", "Press Space", "bc")(t);
                    clicked = true;
                }); 
                $("#click, #scale input").removeAttr("disabled");
            },
            {pause: "key\x01"},
            {pause: "key\x01"},
            function(t){ send_answer(t.response, t); }
        ]
    }],
    
    ["practice", "DynamicQuestion", {
        legend: "practice2",
        //sentence: get_sentence("Ryan has two children.", "His third is already in second grade"),
        sentence: get_sentence("Ana forgot to water her plants, and not a single one survived.", "Now some of Ana's plants are dead."),
        enabled: false,
        sequence: [
            {pause: 300},
            {this: "sentence"},
            {this: "scale"},
            function(t){ $("#click, #scale input").attr("disabled", true); },
            {pause: 500},
            //TT("#sentence", "Here, Ryan is only said to have two children first, but then a reference is made to his third child.", "Press Space", "bc"),
            TT("#sentence", "Here, the text first says that none of Ana's plants survived, and then it goes on saying that some of them are dead.", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#sentence", "Something sounds off in this text: one would expect the conclusion to be that <i>all</i> of Ana's plants are dead.", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#scale", "So in this case, you want to report that the text sounds UNnatural.", "Press Space and click on the scale", "bc"),
            {pause: "key\x01"},
            function(t){ $("#click, #scale input").removeAttr("disabled"); },
            clickButton(
                function(answer, tbis) {
                    tbis.response = answer;
                    if (answer > 3) TT("#click", "Wrong: the text is unnatural.", "Press Space", "bc")(tbis);
                    else TT("#click", "Right: the text is unnatural.", "Press Space", "bc")(tbis);
                }
            ),
            {pause: "key\x01"},
            function(t){ send_answer(t.response, t); }
        ]
    }],

    /*["practice", "DynamicQuestion", {
        legend: "practice3",
        sentence: get_sentence("Ryan has two children", "His third is already in second grade"),
        //inference: get_context("Ryan studied economics"),
        answers: {CU: "Completely unnatural", QU: "Quite unnatural", SU: "Unnatural-ish",
                  N: "So-so", SN: "Natural-ish", QN: "Quite natural", CN: "Completely natural"},
        enabled: true,
        sequence: [
            {pause: 300},
            {this: "sentence"},
            //{this: "scale"},
            {pause: 300},
            {this: "answers"}
        ]
    }], */   
        
    
   ["practice", "Message", {html: "Good. Now we are going to start the actual experiment. Press any key to continue.", transfer: "keypress"}],
    
   /*
   ["postExp", "Form", {html: {include:"ProlificFeedbackPreConfirmation.html"}}],
    
   ["postExp", "__SendResults__", {}],
   
   ["postExp", "Message", {html: {include: "ProlificConfirmation.html"}, transfer: null}]
   */

    ].concat(
      GetItemsFrom(data, null,
        {
          ItemGroup: ["item", "group"],
          Elements: [
                      "test",                       // Label of the item
                      "DynamicQuestion",            // Controller
                      {
                        legend: function(x){ return [x.item,x.group,x.condition,x.ContextType,x.trigger,x.sentence.replace(',',''),x.inference.replace(',','')].join("+"); },
                        sentence: function(x){ return get_sentence(x.Context,x.sentence); },
                        //inference: function(x){ return get_context(x.inference); },
                        sequence:function(x){
                            var debug = "";
                            if (Parameters.hasOwnProperty("Debug")) 
                                debug = "Item: "+x.item+"; Group: "+x.group+"; Context: "+x.ContextType+"; Order: "+x.internal_order+"; Type: "+x.type+"; Condition: "+x.condition;
                            return [
                              debug,
                              {pause: 250},
                              {this: "sentence"},
                              //{this: "inference"},
                              {this: "scale"},
                              clickButton(send_answer)
                            ];
                        }
                      }
                    ]
        }        
      )
);
