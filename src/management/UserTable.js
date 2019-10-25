import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import './UserTable.css';

class UserTable extends React.Component {
	constructor(props) {
		super(props);

		// TODO: Wire up real data.
		this.state = { selected: {}, selectAll: 0, data: makeData() };

		this.toggleRow = this.toggleRow.bind(this);
	}

	toggleRow(email) {
		const newSelected = Object.assign({}, this.state.selected);
		newSelected[email] = !this.state.selected[email];
		this.setState({
			selected: newSelected,
			selectAll: 2,
		});
	}

	toggleSelectAll() {
		let newSelected = {};

		if (this.state.selectAll === 0) {
			this.state.data.forEach(x => {
				newSelected[x.email] = true;
			});
		}

		this.setState({
			selected: newSelected,
			selectAll: this.state.selectAll === 0 ? 1 : 0,
		});
	}

	render() {
		const columns = [
			{
				Header: () => {
					const numSelected = Object.values(this.state.selected).filter(v => !!v).length;
					return `${numSelected} selected`;
				},
				columns: [
					{
						id: 'checkbox',
						accessor: '',
						Cell: ({ original }) => {
							return (
								<input
									type='checkbox'
									className='checkbox'
									checked={this.state.selected[original.email] === true}
									onChange={() => this.toggleRow(original.email)}
								/>
							);
						},
						Header: () => {
							return (
								<input
									type='checkbox'
									className='checkbox'
									checked={this.state.selectAll === 1}
									ref={input => {
										if (input) {
											input.indeterminate = this.state.selectAll === 2;
										}
									}}
									onChange={() => this.toggleSelectAll()}
								/>
							);
						},
						sortable: false,
						width: 50,
					},
					{
						Header: 'Name',
						id: 'name',
						accessor: d => d.name,
					},
					{
						Header: 'Email',
						id: 'email',
						accessor: d => d.email,
					},
					{
						Header: 'Role',
						accessor: 'role',
					},
				],
			}
		];

		return (
			<div>
				<ReactTable
					data={this.state.data}
					columns={columns}
					defaultSorted={[{ id: 'name', desc: false }]}
					className='user-table'
				/>
			</div>
		);
	}
}

export default UserTable;

function makeData() {
	return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(i => {
		return {
			name: 'Dimsum' + i,
			email: i + '@dimsum.com',
			role: 'Admin',
		}
	});
}