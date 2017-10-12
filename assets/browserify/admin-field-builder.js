'use strict';

import { h, Component, render } from 'preact';
import linkState from 'linkstate';
import { AddToForm, RequiredField, DefaultValue, Placeholder, Label, Wrap } from './field-builder/config-fields.js';
import { htmlgenerate } from './field-builder/html.js';
let Editor;


class FieldBuilder extends Component {
    constructor() {
        super();

        this.state = {
            fieldType: "",
        };

        this.handleCancel = this.handleCancel.bind(this)
    }

    handleCancel() {
        this.setState({ fieldType: "" })
    }

    render(props, state) {
        const fields = {
            "text": "Text",
            "email": "Email",
            "url": "URL",
            "number": "Number",
            "date": "Date",
            "textarea": "Textarea",
            "dropdown": "Dropdown",
            "checkboxes": "Checkboxes",
            "radio-buttons": "Radio buttons",
            "submit": "Submit button",
        };
        const fieldButtons = Object.keys(fields).map((key) => {
                let label = fields[key];
                return (
                    <button type="button" value={key} className={"button " + ( state.fieldType === key ? "active" : "")}
                        onClick={linkState(this, 'fieldType')}>{label}</button>
                )
            }
        );

        return (
            <div class="hf-field-builder">
                <h4>
                    Add field
                </h4>
                <div class="available-fields">
                    {fieldButtons}
                </div>
                <div style="max-width: 480px;">
                    <FieldConfigurator fieldType={this.state.fieldType} onCancel={this.handleCancel} />
                </div>
            </div>
        );
    }
}

class FieldConfigurator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fieldType: props.fieldType,
            fieldLabel: "",
            placeholder: "",
            defaultValue: "",
            wrap: true,
            required: false,
        };

        this.addToForm = this.addToForm.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    componentWillReceiveProps(props) {
        this.setState({ fieldType: props.fieldType })
    }

    addToForm() {
        const html = htmlgenerate(this.state);
        Editor.replaceSelection(html);
    }

    handleKeyPress(e) {
        // stop RETURN from submitting the parent form.
        if(e.keyCode === 13) {
            e.preventDefault();
        }
    }

    handleCancel() {
        this.props.onCancel();
    }

    render() {
        console.log(this.state);
        switch(this.state.fieldType) {
            case "":
            default:
                return "";

            case "text":
            case "email":
            case "url":
            case "number":
            case "textarea":
                return (
                    <div onKeyPress={this.handleKeyPress}>
                        <Label value={this.state.fieldLabel} onChange={linkState(this, 'fieldLabel')}/>
                        <Placeholder value={this.state.placeholder} onChange={linkState(this, 'placeholder')}/>
                        <DefaultValue value={this.state.defaultValue} onChange={linkState(this, 'defaultValue')}/>
                        <RequiredField checked={this.state.required} onChange={linkState(this, 'required')}/>
                        <Wrap checked={this.state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );

            case "submit":
                return (
                    <div onKeyPress={this.handleKeyPress}>
                        <DefaultValue value={this.state.defaultValue} onChange={linkState(this, 'defaultValue')}/>
                        <Wrap checked={this.state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );

            case "date":
                return (
                    <div onKeyPress={this.handleKeyPress}>
                        <Label value={this.state.fieldLabel} onChange={linkState(this, 'fieldLabel')}/>
                        <DefaultValue value={this.state.defaultValue} onChange={linkState(this, 'defaultValue')}/>
                        <RequiredField checked={this.state.required} onChange={linkState(this, 'required')}/>
                        <Wrap checked={this.state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );

            case "radio-buttons":
            case "dropdown":
            case "checkboxes":
                return (
                    <div onKeyPress={this.handleKeyPress}>
                        <Wrap checked={this.state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );
        }

    }
}



export default {
    init: function(editor) {
        Editor = editor;

        render((
            <FieldBuilder />
        ), document.getElementById('hf-field-builder'));
    }
}