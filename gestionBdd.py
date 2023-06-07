#!/usr/bin/python3
import mariadb
from mutagen.mp3 import MP3
import datetime

path = "site/"

class myDatabase:
    def __init__(self):
        self.conn = mariadb.connect(
            user="isen",
            password="isen29",
            host="localhost",
            port=3306,
            database="music"
        )
        self.cursor = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    def dbQuery(self, query):
        try:
            self.cursor.execute(query)
        except mariadb.Error as e:
             return e
        return self.cursor

    def dbCommit(self):
        self.conn.commit()

    def addTypeArtist(self, typeArtist):
        self.dbQuery(f"INSERT INTO type_artist(type_artist) VALUES('{typeArtist}')")

    def addArtist(self, nameArtist, typeArtist, img_path):
        self.dbQuery(f"INSERT INTO artist (name_artist, type_artist, img_path) VALUES('{nameArtist}', '{typeArtist}', '{img_path}')")

    def addTrack(self, name, artist, pathTrack, album):
        myQuery = self.dbQuery(f"SELECT id_artist FROM artist WHERE name_artist='{artist}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no artist with this name")
            return
        id_artist = result[0][0]
        myQuery = self.dbQuery(f"SELECT id_album FROM album WHERE name_album='{album}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no album with this name")
            return
        id_album = result[0][0]
        self.dbQuery(f"INSERT INTO tracks (name_tracks, duration, track_path, id_album, id_artist) VALUES('{name}', '{MP3(path+pathTrack).info.length}', '{pathTrack}', {id_album}, {id_artist})")


    def addAlbum(self, name, date_published, img_path, artist, style):
        myQuery = self.dbQuery(f"SELECT id_artist FROM artist WHERE name_artist='{artist}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no artist with this name")
            return
        id_artist = result[0][0]
        self.dbQuery(f"INSERT INTO album(name_album, date_published, img_path, id_artist) VALUES('{name}', '{datetime.datetime(date_published[2], date_published[1], date_published[0]).strftime('%Y-%m-%d %H:%M:%S')}', '{img_path}', '{id_artist}')")
        myQuery = self.dbQuery(f"SELECT id_album FROM album WHERE name_album='{name}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no album with this name")
            return
        id_album = result[0][0]
        self.dbQuery(f"INSERT INTO is_style(style, id_album) VALUES('{style}', '{id_album}')")


    def addAlbumStyle(self, style):
        self.dbQuery(f"INSERT INTO album_style(style) VALUES('{style}')")

    def delTypeArtist(self, type_artist):
        self.dbQuery(f"DELETE FROM type_artist WHERE type_artist='{type_artist}'")

    def delAlbumStyle(self, style):
        idAlbumsWithStyle = self.dbQuery(f"SELECT id_album FROM is_style WHERE style='{style}'")
        result = idAlbumsWithStyle.fetchall()
        albumsWithStyle = []
        for i in range(len(result)):
            myQuery = self.dbQuery(f"SELECT name_album FROM album WHERE id_album={idAlbumsWithStyle[i][0]}")
            result = myQuery.fetchall()
            if result != []:
                albumsWithStyle.append(result[0][0])
        for album in albumsWithStyle:
            self.delAlbum(album)
        self.dbQuery(f"DELETE FROM is_style WHERE style='{style}'")
        self.dbQuery(f"DELETE FROM album_style WHERE style='{style}'")


    def delAlbum(self, nameAlbum, delTracks = False):
        myQuery = self.dbQuery(f"SELECT id_album FROM album WHERE name_album='{nameAlbum}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no album with this name")
            return
        id_album = result[0][0]
        self.dbQuery(f"DELETE FROM is_style WHERE id_album={id_album}")
        tracksInAlbum = self.dbQuery(f"SELECT name_tracks FROM tracks WHERE id_album={id_album}")
        result = myQuery.fetchall()
        for i in range(len(result)):
            self.delTrack(result[i][0])
        self.dbQuery(f"DELETE FROM album WHERE id_album={id_album}")

    def delArtist(self, nameArtist):
        myQuery = self.dbQuery(f"SELECT id_artist FROM artist WHERE name_artist='{nameArtist}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no artist with this name")
            return
        id_artist = result[0][0]
        myQuery = self.dbQuery(f"SELECT name_album FROM album WHERE id_artist={id_artist}")
        result = myQuery.fetchall()
        for i in range(len(result)):
            self.delAlbum(result[i][0])
        self.dbQuery(f"DELETE FROM artist WHERE id_artist={id_artist}")

    def delTrack(self, track):
        myQuery = self.dbQuery(f"SELECT id_tracks FROM tracks WHERE name_tracks='{track}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no tracks with this name")
            return
        id_tracks= result[0][0]
        self.dbQuery(f"DELETE FROM favorites_tracks WHERE id_tracks={id_tracks}")
        self.dbQuery(f"DELETE FROM playlist_tracks WHERE id_tracks={id_tracks}")
        self.dbQuery(f"DELETE FROM tracks WHERE id_tracks={id_tracks}")

if __name__ == '__main__':
    db = myDatabase()

    # ALBUM STYLE
    db.addAlbumStyle("Rap")
    db.addAlbumStyle("Rock")
    db.addAlbumStyle("Pop")

    # TYPE ARTISTE
    db.addTypeArtist("Solo")
    db.addTypeArtist("Groupe")

    db.dbCommit()

    #AJOUTER ARTISTE
    db.addArtist("Maitre Gims", "Solo", "assets/ressources/artist_img/gims.jpeg")
    db.addArtist("Nirvana", "Groupe", "assets/ressources/artist_img/nirvana.jpeg")
    db.addArtist("Lana Del Rey", "Solo", "assets/ressources/artist_img/lana-del-rey.jpeg")

    db.dbCommit()

    #AJOUTER ALBUM
    db.addAlbum("Mon coeur avait raison", (28,8,2015), "assets/ressources/album_img/mon-coeur-avait-raison.jpeg", "Maitre Gims", "Rap")
    db.addAlbum("Nevermind", (24,9,1991), "assets/ressources/album_img/nevermind.jpeg", "Nirvana", "Rock")
    db.addAlbum("Bleach", (15,6,1989), "assets/ressources/album_img/bleach.jpeg" ,"Nirvana", "Rock")
    db.addAlbum("Paradise", (9,11,2012), "assets/ressources/album_img/paradise.jpeg", "Lana Del Rey", "Pop")

    db.dbCommit()

    #AJOUTER MORCEAU
    db.addTrack("Best life", "Maitre Gims", "assets/ressources/musique/trm.mp3", "Mon coeur avait raison")
    db.addTrack("Mirage", "Maitre Gims", "assets/ressources/musique/trm.mp3", "Mon coeur avait raison")
    db.addTrack("J'me tire", "Maitre Gims", "assets/ressources/musique/trm.mp3", "Mon coeur avait raison")
    db.addTrack("Bella", "Maitre Gims", "assets/ressources/musique/bella.mp3", "Mon coeur avait raison")
    db.addTrack("All Electric", "Nirvana", "assets/ressources/musique/trm.mp3", "Nevermind")
    db.addTrack("Critical", "Nirvana", "assets/ressources/musique/critical.mp3", "Nevermind")
    db.addTrack("Total Access", "Nirvana", "assets/ressources/musique/trm.mp3", "Nevermind")
    db.addTrack("Twist My Hips", "Nirvana", "assets/ressources/musique/trm.mp3", "Nevermind")
    db.addTrack("Not Too Young", "Nirvana", "assets/ressources/musique/trm.mp3", "Nevermind")
    db.addTrack("Twist My Hips", "Nirvana", "assets/ressources/musique/trm.mp3", "Nevermind")
    db.addTrack("Blew", "Nirvana", "assets/ressources/musique/trm.mp3", "Bleach")
    db.addTrack("School", "Nirvana", "assets/ressources/musique/school.mp3", "Bleach")
    db.addTrack("Love Buzz", "Nirvana", "assets/ressources/musique/trm.mp3", "Bleach")
    db.addTrack("Blew", "Lana Del Rey", "assets/ressources/musique/trm.mp3", "Paradise")
    db.addTrack("American", "Lana Del Rey", "assets/ressources/musique/american.mp3", "Paradise")
    db.addTrack("Yayo", "Lana Del Rey", "assets/ressources/musique/trm.mp3", "Paradise")
    db.addTrack("Bel Air", "Lana Del Rey", "assets/ressources/musique/trm.mp3", "Paradise")

    db.dbCommit()
