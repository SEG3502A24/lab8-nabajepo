const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const { GraphQLScalarType, Kind } = require('graphql');
const Employee = require('./models/Employee');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/employeeDB')
// Définir le type Date personnalisé
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar type for Date',
  parseValue(value) {
    return new Date(value);  // Convertir les valeurs de type Date en Date
  },
  serialize(value) {
    return value.toISOString();  // Convertir la valeur de Date en string
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);  // Parse un littéral string en Date
    }
    return null;
  },
});

// Définir le schéma GraphQL
const typeDefs = gql`
  scalar Date

  type Employee {
    name: String!
    dateOfBirth: String!
    city: String!
    salary: Float!
    gender: String
    email: String
  }

  type Query {
    employees: [Employee]
  }

  type Mutation {
    addEmployee(
      name: String!
      dateOfBirth: Date!
      city: String!
      salary: Float!
      gender: String
      email: String
    ): Employee
  }
`;

// Définir les résolveurs
const resolvers = {
  Date: DateScalar,
  Query: {
    employees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw new Error('Could not fetch employees');
      }
    },
  },
  Mutation: {
    addEmployee: async (_, { name, dateOfBirth, city, salary, gender, email }) => {
      try {
        const employee = new Employee({ name, dateOfBirth, city, salary, gender, email });
        return await employee.save();
      } catch (error) {
        console.error('Error adding employee:', error);
        throw new Error('Could not add employee');
      }
    },
  },
};

// Créer et démarrer le serveur Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
