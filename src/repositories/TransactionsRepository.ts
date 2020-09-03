import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (acc: Balance, curr: Transaction) => {
        return curr.type === 'income'
          ? {
              ...acc,
              income: acc.income + curr.value,
              total: acc.total + curr.value,
            }
          : {
              ...acc,
              outcome: acc.outcome + curr.value,
              total: acc.total - curr.value,
            };
      },
      { income: 0, outcome: 0, total: 0 },
    );
    return balance;
  }
}

export default TransactionsRepository;
