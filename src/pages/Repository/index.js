import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import Container from '../../components/Container';

import { Loading, Owner, IssueList, PaginationContainer } from './styles';

export default class Repository extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: {},
      issues: [],
      loading: true,
      page: 1,
    };
  }

  async componentDidMount() {
    const { match } = this.props;

    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues?page=${page}`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  componentDidUpdate(_, prevState) {
    const { page } = this.state;

    if (prevState.page !== page) {
      this.updateIssuesList(page);
    }
  }

  handleNextPage = async () => {
    const { page } = this.state;
    this.setState({
      page: page + 1,
    });
  };

  updateIssuesList = async (page) => {
    const { repository } = this.state;
    const response = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        page,
        state: 'open',
        per_page: 5,
      },
    });
    this.setState({
      issues: response.data,
    });
  };

  handlePreviousPage = async () => {
    const { page } = this.state;
    this.setState({
      page: page - 1,
    });
  };

  render() {
    const { repository, issues, loading, page } = this.state;
    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar para os repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PaginationContainer>
          {page > 1 && (
            <button type="button" onClick={this.handlePreviousPage}>
              Issues Anteriores
            </button>
          )}
          <button type="button" onClick={this.handleNextPage}>
            Proximas Issues
          </button>
        </PaginationContainer>
      </Container>
    );
  }
}
Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
