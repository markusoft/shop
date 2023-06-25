TemplateConfig = {
    license: 'ebc1a535a0b1e3acc17787a314509da7f7e20ed5c656447f001b49c5f444503d',
    name: 'Lazy',
//    prefix: 'prsft-',
    animations: {
        fadeIn: {opacity: [0, 1]},
        fadeOut: {opacity: [1, 0]},
        zoomIn: {transform: ['scale(.5)', 'scale{1}']},
        zoomOut: {transform: ['scale(1)', 'scale{.5}']},
        slideIn: {left: ['100%', '0']},
        slideOut: {left: ['0', '100%']},
        flip: {transform: ['rotateY(0deg)', 'rotateY(180deg)']},
        tada: {}
    },
    block: {},
    loader: {},
    dialog: {},
    modal: {},
    overlay: {},
    modalHeaders: {
        custom: function(opt) {
            return `<button class="${opt.prefix}btn ${opt.prefix}modal-cancel"  aria-label="${opt.cancel}"><span>${opt.cancel}</span></button><div class="${opt.prefix}modal-title">${opt.title}</div><button class="${opt.prefix}btn ${opt.prefix}modal-ok" aria-label="${opt.ok}"><span>${opt.ok}</span></button>`;
        },
        static: `<div>Modal Header</div>`
    },
    modalFooters: {
        custom: function(opt) {
            return `<button class="${opt.prefix}btn ${opt.prefix}modal-cancel" aria-label="${opt.cancel}"><span>${opt.cancel}</span></button><button class="${opt.prefix}btn ${opt.prefix}modal-ok" aria-label="${opt.ok}"><span>${opt.ok}</span></button>`;
        },
        static: '<div>Modal Footer</div>'
    },
    validationRules: {
        alpha: function(val){ return val.match(/^([a-z])+$/i) ? true : false; },
        max: function(val, max){ return val.length <= max; }
    },
    validationMessages: {
        alpha: function(val){ return `${val} should only contain letters`; },
        max: function(val, max){ return `${val} should not exceed ${max} characters`; },
        static: 'Invalid Input'
    },
    fake: {
        mobile: function(){ return Math.floor(Math.random() * 1000000000); }
    },
    fakers: {
//        firstNames: ['Mark', 'Angelo'],
//        lastNames: ['Angulo', 'Dalit', 'Reyes'],
//        domains: ['aol', 'gmail', 'outlook', 'yahoo'],
//        password: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$',
//        nouns: ['time', 'year', 'people', 'way', 'day', 'man'],
//        adjectives: ['new', 'good', 'high', 'old', 'great']
    }
};