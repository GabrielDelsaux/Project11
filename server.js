require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306)
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});

app.use(express.static('public'));
app.use(express.json());


function requireToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Connexion requise.' });

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) return res.status(401).json({ message: 'Token invalide.' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  requireToken(req, res, () => {
    if (req.user.login !== 'admin') {
      return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
    }
    next();
  });
}

////////////////////////////////////////////////////////////// ROUTES ////////////////////////////////////////////////////////////////

// Inscription avec mot de passe haché et ne pas pouvoir créer 2 user avec le même login
app.post('/register', async (req, res) => {

  if (!req.body.inputValue || !req.body.password) {
    return res.status(400).json({ message: 'Login et mot de passe requis.' });
  }

  connection.query('SELECT * FROM user WHERE login = ?', [req.body.inputValue], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification du login :', err);
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ message: 'Login déjà utilisé.' });
      return;
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      connection.query(
        'INSERT INTO user (login, password) VALUES (?, ?)',
        [req.body.inputValue, hashedPassword],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion dans la base de données :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;
          }
          res.json({ message: 'Inscription réussie !', userId: results.insertId });
        }
      );
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
    }
  });
});

  //route se connecter 
  app.post('/connexion', (req, res) => {
    const { login, password } = req.body;
    connection.query('SELECT * FROM user WHERE login = ?', [login], async (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification des identifiants :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }
      if (results.length === 0) {
        res.status(401).json({ message: 'Identifiants invalides' });
        return;
      }

      try {
        const passwordIsValid = await bcrypt.compare(password, results[0].password);
        if (!passwordIsValid) {
          res.status(401).json({ message: 'Identifiants invalides' });
          return;
        }

        const user = { Id: results[0].Id, login: results[0].login };
        const token = jwt.sign(user, tokenSecret, { expiresIn: '1h' });
        res.json({ message: 'Connexion réussie !', user, token });
      } catch (compareErr) {
        console.error('Erreur lors de la vérification du mot de passe :', compareErr);
        res.status(500).json({ message: 'Erreur serveur' });
      }
    });
  });

  app.get('/session', requireToken, (req, res) => {
    res.json({ user: req.user });
  });

  //route qui permet au user de supprimer son compte 
  app.post('/supprimerCompte', requireToken, (req, res) => {
    const user = req.user;
    if (user.login === 'admin') {
      res.status(403).json({ message: 'Suppression non autorisée.' });
      return;
    }

    connection.query(
      'DELETE FROM user WHERE Id = ? AND login <> ?',
      [user.Id, 'admin'],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de la suppression dans la base de données :', err);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
        if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Compte introuvable ou suppression non autorisée.' });
          return;
        }
        res.json({ message: 'Suppression réussie !' });
      }
    );
  });


  //route qui permet de récupérer tout les utilisateurs sauf l'admin
  app.get('/afficherUsers', requireAdmin, (req, res) => {
    connection.query('SELECT Id, login FROM user WHERE login != ?', ['admin'], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }
      res.json({ message: 'Liste des utilisateurs récupérée avec succès !', user: results });
    });
  });

  // Supprime l'utilisateur demandé, après vérification de l'admin.
  app.post('/supprimerUser', requireAdmin, (req, res) => {
    connection.query(
      'DELETE FROM user WHERE Id = ? AND login <> ?',
      [req.body.id, 'admin'],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de la suppression dans la base de données :', err);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
        if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Utilisateur introuvable ou suppression non autorisée.' });
          return;
        }
        res.json({ message: 'Suppression réussie !' });
      }
    );
  });

  //route qui permet de changer le mot de passe d'un utilisateur et on ne peux pas changer pour remettre le même mot de passe que l'ancien
  app.post('/changerMotDePasse', requireToken, async (req, res) => {
    const user = req.user;
    const newPassword = req.body.newPassword;

    try {
      // Vérifier si le nouveau mot de passe est le même que l'ancien
      connection.query('SELECT password FROM user WHERE Id = ?', [user.Id], async (err, results) => {
        if (err) {
          console.error('Erreur lors de la récupération du mot de passe :', err);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
        if (results.length === 0) {
          res.status(404).json({ message: 'Utilisateur introuvable.' });
          return;
        }

        const currentHashedPassword = results[0].password;
        const isSamePassword = await bcrypt.compare(newPassword, currentHashedPassword);
        if (isSamePassword) {
          res.status(400).json({ message: 'Le nouveau mot de passe ne peut pas être le même que l\'ancien.' });
          return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        connection.query(
          'UPDATE user SET password = ? WHERE Id = ?',
          [hashedPassword, user.Id],
          (err, results) => {
            if (err) {
              console.error('Erreur lors de la mise à jour du mot de passe :', err);
              res.status(500).json({ message: 'Erreur serveur' });
              return;
            }
            if (results.affectedRows === 0) {
              res.status(404).json({ message: 'Utilisateur introuvable.' });
              return;
            }
            res.json({ message: 'Mot de passe changé avec succès !' });
          }
        );
      });
    } catch (err) {
      console.error('Erreur lors du hachage du mot de passe :', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });