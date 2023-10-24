const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 23});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too big, expect 20, got 23');
    });

    it('валидатор проверяет тип поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 'twenty'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('expect number, got string');
    });

    it('валидатор возвращает ошибку если тип не поддерживается', () => {
      const validator = new Validator({
        abc: {
          type: 'object',
          min: 1,
          max: 5,
        },
      });

      const errors = validator.validate({
        abc: {a: 1},
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('abc');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('unsupported type object');
    });
  });
});
