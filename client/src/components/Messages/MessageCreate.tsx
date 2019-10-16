import * as React from "react";
import { TextField, CardActions, Button } from 'react-md';
import { Mutation } from 'react-apollo';
import { CREATE_MESSAGE } from '../../queries/message';
import { ErrorMessages } from '../Helpers/Error/ErrorMessage';

interface CreateMessageState {
  text: string;
}

interface CreateMessageProps {
  session: any,
  filter: any
}

const INITIAL_STATE = {
  text: ''
};

class MessageCreate extends React.Component<CreateMessageProps, CreateMessageState> {

  componentWillMount() {
    this.setState({...INITIAL_STATE});
  }

  onChange = (value, event) => {
    if (!event) { return; }
    switch(event.target.id) {
      case 'text': {
        this.setState({ text: value });
        break;
      }
    }
  };

  onSubmit = (event, createMessage) => {
    createMessage().then(async ({ data }) => {
      this.setState({...INITIAL_STATE});
    });
    event.preventDefault();
  };

  componentWillUnmount() {
    this.setState = (state,callback) => {
      return;
    }
  }

  public render() {
    const { text } = this.state;
    const { filter } = this.props;
    const isInvalid = text === '' ;
    return (
      <Mutation mutation={CREATE_MESSAGE} variables={{ text, filter }}>
        {(createMessage, { data, loading, error }) => (
          <form className="md-grid text-fields__application" onSubmit={event => this.onSubmit(event, createMessage)}>
            <TextField
              id="text"
              name="text"
              value={text}
              onChange={this.onChange}
              rows={2}
              maxLength={200}
              label="Message text"
              className="md-cell md-cell--12"
            />
            <div  className="md-cell md-cell--12">
              {error && error.graphQLErrors && error.graphQLErrors.length && <ErrorMessages errors={error.graphQLErrors}/>}
            </div>
            <CardActions className="md-cell md-cell--12">
              <Button
                raised
                primary
                className="md-cell--right"
                disabled={isInvalid || loading}
                type="submit">
                Send
              </Button>
            </CardActions>
          </form>
        )}
      </Mutation>
    );
  }

}

export default MessageCreate;
