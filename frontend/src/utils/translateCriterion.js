export const translateCriterion = (criterion, t, lang) => {
  if (!criterion || typeof criterion !== 'string') return criterion;
  if (lang !== 'hi') return criterion;

  let text = criterion;

  // Direct replacements
  text = text.replace(/State match \((.*?)\)/g, 'राज्य मेल ($1)');
  text = text.replace(/Nationwide scheme \(All States\/UTs eligible\)/g, 'देशव्यापी योजना (सभी राज्य/केंद्र शासित प्रदेश पात्र)');
  text = text.replace(/Age match \((\d+) yrs within (\d+)-(\d+)\)/g, 'आयु मेल ($1 वर्ष, $2-$3 के भीतर)');
  text = text.replace(/Income match \(₹([\d,]+) within ₹([\d,]+)\)/g, 'आय मेल (₹$1, सीमा ₹$2 के भीतर)');
  text = text.replace(/Social category match \((.*?)\)/g, 'सामाजिक वर्ग मेल ($1)');
  text = text.replace(/All social categories eligible/g, 'सभी सामाजिक वर्ग पात्र');
  text = text.replace(/Gender criteria met \((.*?)\)/g, 'लिंग मानदंड मेल ($1)');
  text = text.replace(/Open to all genders/g, 'सभी लिंगों के लिए खुला');
  text = text.replace(/Occupation match \((.*?)\)/g, 'व्यवसाय मेल ($1)');
  text = text.replace(/Open to all occupations/g, 'सभी व्यवसायों के लिए खुला');
  text = text.replace(/Special support for Persons with Disabilities \(PwD\)/g, 'दिव्यांगजनों (PwD) के लिए विशेष सहायता');
  text = text.replace(/Special condition met \((.*?)\)/g, 'विशेष स्थिति मेल ($1)');

  // Failed criteria replacements
  text = text.replace(/Requires residency in (.*)/g, '$1 में निवास आवश्यक है');
  text = text.replace(/Age (\d+) is outside eligible range \((\d+)-(\d+)\)/g, 'आयु $1 पात्र सीमा ($2-$3) के बाहर है');
  text = text.replace(/Income ₹([\d,]+) exceeds maximum threshold ₹([\d,]+)/g, 'आय ₹$1 अधिकतम सीमा ₹$2 से अधिक है');
  text = text.replace(/Social category (.*?) not eligible/g, 'सामाजिक वर्ग $1 पात्र नहीं है');
  text = text.replace(/Gender (.*?) not eligible/g, 'लिंग $1 पात्र नहीं है');
  text = text.replace(/Occupation (.*?) not eligible/g, 'व्यवसाय $1 पात्र नहीं है');
  text = text.replace(/Requires Persons with Benchmark Disability \(PwD\) status/g, 'दिव्यांगजन (PwD) होना आवश्यक है');

  return text;
};
