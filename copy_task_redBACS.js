/**
 *
 * copy_task_redBACS.js
 * William Xiang Quan Ngiam
 * for Yasmin Isa's Honours (2025)
 *
 * task script for pattern copy task
 * does copy task performance change with the addition of colour load
 *
 * started coding: 4/3/25
 * changed to eight BACS versus four BACS * 2 colours (red,blue)
 * includes three between-subjects conditions: interleaved, colour first, no colour first
 * 
 * this is the demo code, showing only the interleaved condition for ease.
 **/

/* Initialize jsPsych */
var jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false
});

// Set-up DataPipe (in future, auto-upload to OSF)
// generate a random subject ID with 10 characters
const subject_id = `${jsPsych.randomization.randomID(10)}`;
const filename = `${subject_id}.csv`;

// add subject_id to data
jsPsych.data.addProperties({
    subject: subject_id,
});

// DEFINE EXPERIMENT VARIABLES
const n_trials = 60; // Number of trials in the experiment, should be even
const n_items = 6; // Number of items in the copy grid
const n_stimuli = 2 // No colour versus colour
var stimuli = ["BACS", "colourBACS"]

// EXPERIMENT STIMULI
// Colours (for practice trial)
const colours = ['colours/blue.png', 'colours/green.png','colours/red.png','colours/yellow.png']

// Brussels Artificial Character Set (BACS)
const BACS = ['bacs/BACS_J.png', 'bacs/BACS_R.png', 'bacs/BACS_X.png', 'bacs/BACS_K.png',
    'bacs/BACS_P.png', 'bacs/BACS_G.png', 'bacs/BACS_V.png', 'bacs/BACS_B.png'
] // these eight are the most dissimilar

// Coloured BACS
const colouredBACS = ['bacs_colour/BACS_J_red.png', 'bacs_colour/BACS_R_red.png', 'bacs_colour/BACS_X_red.png', 'bacs_colour/BACS_K_red.png',
    'bacs_colour/BACS_J_blue.png', 'bacs_colour/BACS_R_blue.png', 'bacs_colour/BACS_X_blue.png', 'bacs_colour/BACS_K_blue.png'
] // select eight to keep number of choices constant.

// BUILD EXPERIMENT
// There are three experiment conditions: interleaved; baseline first; conjunction first
const timeline_interleaved = []
//const timeline_baselineFirst = []
//const timeline_conjunctionFirst = []

/* force fullscreen */
var enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
}
timeline_interleaved.push(enter_fullscreen);
//timeline_baselineFirst.push(enter_fullscreen);
//timeline_conjunctionFirst.push(enter_fullscreen);

/* screen resize */
var resize = {
    type: jsPsychResize,
    item_width: 3 + 3 / 8,
    item_height: 2 + 1 / 8,
    prompt: "<p>Click and drag the lower right corner of the box until the box is the same size as a credit card held up to the screen.</p>",
    pixels_per_unit: 150
};
timeline_interleaved.push(resize);
//timeline_baselineFirst.push(resize);
//timeline_conjunctionFirst.push(resize);

// preload stimuli
const preload = {
    type: jsPsychPreload,
    images: [colouredBACS, BACS],
};
timeline_interleaved.push(preload);
//timeline_baselineFirst.push(preload);
//timeline_conjunctionFirst.push(preload);

/* define welcome message trial */
/* add consent form here? */
var welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Welcome to the demo.</p>
    <br>
`,
    choices: [">>"],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline_interleaved.push(welcome);

/* show task instructions */
var instructions_1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <img src="instructions/show_model_grid.png" width=800 height=240>
    <p>On each trial, you will start by seeing a model grid on the left. Your task is to recreate this grid on the right.</p>
    <p>When your mouse cursor hovers over the model grid (on the left), the model grid will be visible.</p>
    <p>However, when your mouse cursor moves over to the right, the model grid will no longer be visible.</p>
    <p>You may return and check the model grid as you wish.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline_interleaved.push(instructions_1);

var instructions_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <img src="instructions/show_resource_grid.png" width-800 height=240>
    <p>To recreate the model grid, drag and drop items from the resource pool on the right.</p>
    <p>If you drop the correct item in the correct location, it will lock into place.</p>
    <p>If you drop the wrong item or drop an item in the wrong location, it will wriggle before returning to the pool.</p>
    <p>A trial is completed when the model grid has been successfully recreated.</p>
    <p>There will be one practice trial before you begin the experiment.</p>
    <p>Press the button below when you are ready.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline_interleaved.push(instructions_2);

/* practice trial */
// CREATE GRIDS
// programmatically create a model grid (4 by 4) with 6 items
var practice_rows = 4
var practice_cols = 4
var practice_n_items = 4

// create resource grid and select items
var resource_grid_contents = [[colours[0], colours[1], colours[2], colours[3]]]
var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(colours, practice_n_items)
// select unique (sample WITHOUT replacement) positions in the model grid to place the items in
var selected_model_grid_indices = jsPsych.randomization.sampleWithoutReplacement([...Array((practice_rows * practice_cols)).keys()], practice_n_items)

var model_grid_contents = []

for (var r = 0; r < practice_rows; r++) {
    model_grid_contents[r] = []
    for (var c = 0; c < practice_cols; c++) {
        let index = r * practice_cols + c
        if (selected_model_grid_indices.includes(index)) {
            model_grid_contents[r][c] = selected_model_items.pop()
        } else {
            model_grid_contents[r][c] = null
        }
    }
}

var start_practice = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "",
    choices: ["Start practice trial"],
    button_html: ['<button class="jspsych-btn" style="position:relative; right:325px">%choice%</button>'],
}
timeline_interleaved.push(start_practice)

var practice_trial = {
    type: jsPsychCopyingTask,
    model_grid_contents: model_grid_contents,
    resource_grid_contents: resource_grid_contents,
    canvas_width: 1300,
    item_file_type: "img",
    prompt: 'Copy the left grid onto the right grid',
}

timeline_interleaved.push(practice_trial)

/* start experiment instructions */
var start_experiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>You have now completed the practice trial.</p>
    <p>There are 60 trials in total.</p>
    <p>The experiment will begin on the next trial.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>'],
    on_start: function() {
        jsPsych.progressBar.progress = 0
    }
};
timeline_interleaved.push(start_experiment);

// TRIAL LOOP
// Interleaved trials
var trial_order = jsPsych.randomization.repeat(stimuli, n_trials / n_stimuli, false)

for (var t = 0; t < n_trials; t++) {

    // GET TRIAL CONDITION
    this_trial_condition = trial_order[t]

    // CREATE GRIDS
    // programmatically create a model grid (4 by 4) with 6 items 
    var n_rows = 4
    var n_cols = 4
    var n_model_items = n_items // fixed number of items in each trial for now.

    // CREATE RESOURCE GRID AND SELECT MODEL ITEMS
    if (this_trial_condition === "BACS") {
        // load in BACS characters
        var resource_grid_contents = [
            [BACS[0], BACS[1], BACS[2], BACS[3],],
            [BACS[4], BACS[5], BACS[6], BACS[7],],
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(BACS, n_model_items)

    } else {
        // load in Courier New letters
        var resource_grid_contents = [
            [colouredBACS[0], colouredBACS[1], colouredBACS[2], colouredBACS[3],],
            [colouredBACS[4], colouredBACS[5], colouredBACS[6], colouredBACS[7],],
            //           [colouredBACS[8], colouredBACS[9], colouredBACS[10], colouredBACS[11]]
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(colouredBACS, n_model_items)
    }

    // select unique (sample WITHOUT replacement) positions in the model grid to place the items in
    var selected_model_grid_indices = jsPsych.randomization.sampleWithoutReplacement([...Array((n_rows * n_cols)).keys()], n_model_items)

    var model_grid_contents = []

    for (var r = 0; r < n_rows; r++) {
        model_grid_contents[r] = []
        for (var c = 0; c < n_cols; c++) {
            let index = r * n_cols + c
            if (selected_model_grid_indices.includes(index)) {
                model_grid_contents[r][c] = selected_model_items.pop()
            } else {
                model_grid_contents[r][c] = null
            }
        }
    }

    var button_start = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "",
        choices: ["Start trial"],
        button_html: ['<button class="jspsych-btn" style="position:relative; right:325px">%choice%</button>'],
    }
    timeline_interleaved.push(button_start)

    var copy_task = {
        type: jsPsychCopyingTask,
        model_grid_contents: model_grid_contents,
        resource_grid_contents: resource_grid_contents,
        canvas_width: 1300,
        item_file_type: "img",
        prompt: 'Copy the left grid onto the right grid',
    }

    timeline_interleaved.push(copy_task)

}
/* The code below handles condition order.
// Baseline first
const BACS_array = Array(n_trials / 2).fill('BACS')
const colouredBACS_array = Array(n_trials / 2).fill('colourBACS')
var baseline_order = BACS_array.concat(colouredBACS_array)

for (var t = 0; t < n_trials; t++) {

    // GET TRIAL CONDITION
    this_trial_condition = baseline_order[t]

    // CREATE GRIDS
    // programmatically create a model grid (4 by 4) with 6 items 
    var n_rows = 4
    var n_cols = 4
    var n_model_items = n_items // fixed number of items in each trial for now.

    // CREATE RESOURCE GRID AND SELECT MODEL ITEMS
    if (this_trial_condition === "BACS") {
        // load in BACS characters
        var resource_grid_contents = [
            [BACS[0], BACS[1], BACS[2], BACS[3],],
            [BACS[4], BACS[5], BACS[6], BACS[7],],
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(BACS, n_model_items)

    } else {
        // load in Courier New letters
        var resource_grid_contents = [
            [colouredBACS[0], colouredBACS[1], colouredBACS[2], colouredBACS[3],],
            [colouredBACS[4], colouredBACS[5], colouredBACS[6], colouredBACS[7],],
            //           [colouredBACS[8], colouredBACS[9], colouredBACS[10], colouredBACS[11]]
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(colouredBACS, n_model_items)
    }

    // select unique (sample WITHOUT replacement) positions in the model grid to place the items in
    var selected_model_grid_indices = jsPsych.randomization.sampleWithoutReplacement([...Array((n_rows * n_cols)).keys()], n_model_items)

    var model_grid_contents = []

    for (var r = 0; r < n_rows; r++) {
        model_grid_contents[r] = []
        for (var c = 0; c < n_cols; c++) {
            let index = r * n_cols + c
            if (selected_model_grid_indices.includes(index)) {
                model_grid_contents[r][c] = selected_model_items.pop()
            } else {
                model_grid_contents[r][c] = null
            }
        }
    }

    var button_start = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "",
        choices: ["Start trial"],
        button_html: ['<button class="jspsych-btn" style="position:relative; right:325px">%choice%</button>'],
    }
    timeline_baselineFirst.push(button_start)

    var copy_task = {
        type: jsPsychCopyingTask,
        model_grid_contents: model_grid_contents,
        resource_grid_contents: resource_grid_contents,
        canvas_width: 1300,
        item_file_type: "img",
        prompt: 'Copy the left grid onto the right grid',
    }

    timeline_baselineFirst.push(copy_task)

}

// Conjunction first
var conjunction_order = colouredBACS_array.concat(BACS_array)

for (var t = 0; t < n_trials; t++) {

    // GET TRIAL CONDITION
    this_trial_condition = conjunction_order[t]

    // CREATE GRIDS
    // programmatically create a model grid (4 by 4) with 6 items 
    var n_rows = 4
    var n_cols = 4
    var n_model_items = n_items // fixed number of items in each trial for now.

    // CREATE RESOURCE GRID AND SELECT MODEL ITEMS
    if (this_trial_condition === "BACS") {
        // load in BACS characters
        var resource_grid_contents = [
            [BACS[0], BACS[1], BACS[2], BACS[3],],
            [BACS[4], BACS[5], BACS[6], BACS[7],],
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(BACS, n_model_items)

    } else {
        // load in Courier New letters
        var resource_grid_contents = [
            [colouredBACS[0], colouredBACS[1], colouredBACS[2], colouredBACS[3],],
            [colouredBACS[4], colouredBACS[5], colouredBACS[6], colouredBACS[7],],
            //           [colouredBACS[8], colouredBACS[9], colouredBACS[10], colouredBACS[11]]
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(colouredBACS, n_model_items)
    }

    // select unique (sample WITHOUT replacement) positions in the model grid to place the items in
    var selected_model_grid_indices = jsPsych.randomization.sampleWithoutReplacement([...Array((n_rows * n_cols)).keys()], n_model_items)

    var model_grid_contents = []

    for (var r = 0; r < n_rows; r++) {
        model_grid_contents[r] = []
        for (var c = 0; c < n_cols; c++) {
            let index = r * n_cols + c
            if (selected_model_grid_indices.includes(index)) {
                model_grid_contents[r][c] = selected_model_items.pop()
            } else {
                model_grid_contents[r][c] = null
            }
        }
    }

    var button_start = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "",
        choices: ["Start trial"],
        button_html: ['<button class="jspsych-btn" style="position:relative; right:325px">%choice%</button>'],
    }
    timeline_conjunctionFirst.push(button_start)

    var copy_task = {
        type: jsPsychCopyingTask,
        model_grid_contents: model_grid_contents,
        resource_grid_contents: resource_grid_contents,
        canvas_width: 1300,
        item_file_type: "img",
        prompt: 'Copy the left grid onto the right grid',
    }

    timeline_conjunctionFirst.push(copy_task)

}
*/
// Do not save data from demo.
/* upload data 
var save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: "SYZS8VK4A5JT",
    filename: subject_id + `.csv`,
    wait_message: "<p>Saving data. Please do not close this page.</p>",
    data_string: () => jsPsych.data.get().csv()
};
*/
//timeline_interleaved.push(save_data);
//timeline_baselineFirst.push(save_data);
//timeline_conjunctionFirst.push(save_data);

/* end of experiment */
var end_experiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>This is the end of the experiment. Thank you for participating!</p>',
    choices: ["FINISH"],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
}
timeline_interleaved.push(end_experiment);
//timeline_baselineFirst.push(end_experiment);
//timeline_conjunctionFirst.push(end_experiment);

var close_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false
}
timeline_interleaved.push(close_fullscreen);
//timeline_baselineFirst.push(close_fullscreen);
//timeline_conjunctionFirst.push(close_fullscreen);
/* 
// DataPipe controls condition assignment
// Retrieve between-subjects condition
async function createExperiment() {
    const condition = await jsPsychPipe.getCondition("SYZS8VK4A5JT");
    jsPsych.data.addProperties({
        exp_condition: condition
    });
    if (condition == 0) { timeline = timeline_interleaved; }
    if (condition == 1) { timeline = timeline_baselineFirst; }
    if (condition == 2) { timeline = timeline_conjunctionFirst; }
    jsPsych.run(timeline);
}
createExperiment();
*/
jsPsych.run(timeline_interleaved)